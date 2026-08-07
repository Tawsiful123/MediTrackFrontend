# Meditrack — Frontend Doctor Assistant Planning

This is a standalone planning document for the **Doctor Assistant** module of the
Meditrack frontend. It supplements `planning.md` (overall architecture) and
`api-doc.md` (API contract), and reflects the backend changes described in
`assistantplanning (1).md`. Everything else in `planning.md` — Patient, Doctor,
Appointment, Queue, Review, Notification, Chatbot, Admin core — is unchanged.

**Stack:** same as the rest of the app — React + Vite + JavaScript, Tailwind,
React Router v6, TanStack Query, Redux Toolkit (auth/UI only), React Hook Form +
Zod, Axios, react-hot-toast, lucide-react.

---

## 1. What's new / different for this module

| Area | Detail |
|---|---|
| Assistant registration | Public self-signup — `POST /auth/register/assistant`. No doctor selection at signup; `doctorId` starts `null`. |
| Login | No separate flow — assistants use the normal `POST /auth/login`. |
| Doctor assignment | Admin-only. `PATCH /admin/assistants/:id/assign-doctor` with body `{ "doctorId": "..." }` to assign, or `{ "doctorId": null }` to unassign. Same endpoint handles both. |
| Assistants list | `GET /admin/assistants` — needed to populate the admin management table. |
| Suspension | `PATCH /admin/assistants/:id/suspend`, unchanged. |
| Empty state | Dashboard and assigned-doctor views must clearly show "No doctor assigned yet" when `doctorId` is null. |
| Scoping | Assistant actions on appointments/queue are scoped to their assigned doctor; a mismatch returns `403`, which needs distinct messaging from a role-based `403`. |

---

## 2. API layer

### `src/api/authApi.js` — add
```js
export async function registerAssistant(payload) {
  const { data } = await axiosInstance.post('/auth/register/assistant', payload);
  return data;
}
```
**Request body:** `{ fullName, email, password, phone?, designation? }` — no
`doctorId` field. `designation` and `phone` are both optional.

### `src/api/assistantApi.js` — unchanged
```js
export async function getAssistantProfile() { /* GET /assistant/me */ }
export async function updateAssistantProfile(payload) { /* PATCH /assistant/me */ }
export async function getAssistantDashboard() { /* GET /assistant/me/dashboard */ }
export async function getAssignedDoctor() { /* GET /assistant/me/doctor */ }
```

### `src/api/adminApi.js` — add/change
```js
// NEW — list all assistants (with user + assigned doctor info), paginated
export async function getAssistants(params) {
  const { data } = await axiosInstance.get('/admin/assistants', { params });
  return data; // { success, statusCode, message, meta, data }
}

// CHANGED — endpoint renamed from /assign to /assign-doctor; also handles unassign
export async function assignAssistantDoctor(assistantId, doctorId) {
  const { data } = await axiosInstance.patch(
    `/admin/assistants/${assistantId}/assign-doctor`,
    { doctorId } // pass null to unassign
  );
  return data;
}

// UNCHANGED
export async function suspendAssistant(assistantId) {
  const { data } = await axiosInstance.patch(`/admin/assistants/${assistantId}/suspend`);
  return data;
}
```

There is **no separate "remove" endpoint** — unassigning a doctor is the same
call as assigning, with `doctorId: null`.

### Appointment / Queue APIs — unchanged
`appointmentApi.js`, `appointmentRequestApi.js`, `queueApi.js` keep their
existing endpoints (`/appointments/requests`, `/appointments/:id/accept`,
`/appointments/:id/reject`, `/appointments`, `/appointments/:id/reschedule`,
`/appointments/:id/cancel-by-staff`, `/appointments/:id/status`,
`/queue/today`, `/queue/:id/call-next`, `/queue/:id/status`). Only the
*authorization* behind them changed (see section 6), not the paths or bodies.

---

## 3. Validation

### `src/validations/authValidation.js` — add
```js
export const registerAssistantSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  designation: z.string().optional(),
});
```

---

## 4. Hooks

### `src/hooks/auth/useRegisterAssistant.js` (new)
```js
import { useMutation } from '@tanstack/react-query';
import { registerAssistant } from '@/api/authApi';

export function useRegisterAssistant() {
  return useMutation({ mutationFn: registerAssistant });
}
```

### `src/hooks/admin/useAssistantsList.js` (new)
```js
import { useQuery } from '@tanstack/react-query';
import { getAssistants } from '@/api/adminApi';

export function useAssistantsList(params) {
  return useQuery({
    queryKey: ['assistants', params],
    queryFn: () => getAssistants(params),
    keepPreviousData: true,
  });
}
```

### `src/hooks/admin/useAssignAssistantDoctor.js` (renamed from useAssignAssistant)
```js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignAssistantDoctor } from '@/api/adminApi';

export function useAssignAssistantDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assistantId, doctorId }) => assignAssistantDoctor(assistantId, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}
```

### `src/hooks/admin/useRemoveAssistant.js` — **delete**
No longer needed. Unassigning is `useAssignAssistantDoctor().mutate({ assistantId, doctorId: null })`.

### `src/hooks/admin/useSuspendAssistant.js` — unchanged.

### `src/hooks/assistant/*` — unchanged
`useAssistantProfile`, `useUpdateAssistantProfile`, `useAssistantDashboard`,
`useAssignedDoctor` all keep their existing shape.

---

## 5. Pages

### `src/pages/public/RegisterAssistantPage.jsx` (new)
- Fields: `fullName`, `email`, `password`, `phone` (optional), `designation`
  (optional). **No doctor selector** — assignment happens later via Admin.
- `useForm({ resolver: zodResolver(registerAssistantSchema) })`.
- On success: toast "Registration submitted — an admin will assign you to a
  doctor," redirect to `/login`.
- On `409` (email in use): field-level error on `email`.

**Route:** add to `router.jsx` public routes:
```
/register/assistant → RegisterAssistantPage → POST /auth/register/assistant
```
Link to it from `LoginPage.jsx` and `LandingPage.jsx` alongside the existing
patient/doctor registration links.

### `src/pages/admin/AssistantsManagementPage.jsx` (rewire)
- `useAssistantsList({ page, limit })` → table: name, email, designation,
  assigned doctor (or "Unassigned"), status. `<Pagination />` from `meta.total`.
- **Assign:** opens a doctor-picker (reuse a doctor search/select, e.g. backed
  by `useDoctorsList`) → `useAssignAssistantDoctor().mutate({ assistantId, doctorId })`.
- **Unassign:** same mutation with `doctorId: null`; label the button
  "Unassign" in the UI even though it's the same endpoint.
- **Suspend:** `useSuspendAssistant`, wrapped in `<ConfirmDialog />`.

### `src/pages/assistant/AssistantDashboardPage.jsx` (update)
- `useAssistantDashboard()`.
- If the response indicates no doctor assigned (404, or a null-doctor payload
  per backend Part E), render:
  > **No doctor assigned yet. Please contact the administrator.**
  and suppress the queue/appointments widgets rather than showing them empty.
- Otherwise render: assistant info (name, email, phone, designation), assigned
  doctor summary, today's queue snapshot, appointment counts (today, pending
  requests, accepted, completed).

### `src/pages/assistant/AssignedDoctorPage.jsx` (update)
- `useAssignedDoctor()`.
- On 404 ("not yet assigned to a doctor" per api-doc.md), show the same "No
  doctor assigned yet" message instead of the generic `<ErrorState />` copy.
- Otherwise render doctor profile, specialization, hospital/clinic info,
  consultation fee, clinic location, schedule.

### `src/pages/assistant/AssistantProfilePage.jsx` — unchanged
`useAssistantProfile` / `useUpdateAssistantProfile`, editable fields only
(never `doctorId`).

### `src/pages/assistant/AppointmentRequestsPage.jsx`,
### `src/pages/assistant/AllAppointmentsPage.jsx`,
### `src/pages/assistant/QueueManagementPage.jsx` — unchanged in structure,
see section 6 for the one behavioral change (403 messaging).

---

## 6. Doctor-scoping 403 handling

Backend now scopes assistant actions to their assigned doctor: acting on a
resource (appointment or queue entry) belonging to a different doctor returns
`403`. This is not a role mismatch, so it shouldn't get the generic "You don't
have permission to do that" copy used elsewhere (planning.md §11).

Apply a specific toast message in these mutation hooks' `onError`:

- `useAcceptRequest`
- `useRejectRequest`
- `useRescheduleAppointment`
- `useCancelByStaff`
- `useUpdateAppointmentStatus`
- `useCallNext`
- `useUpdateQueueStatus`

```js
onError: (error) => {
  if (error.response?.status === 403) {
    toast.error("This doesn't belong to your assigned doctor.");
  } else {
    toast.error(getErrorMessage(error));
  }
}
```

All other status codes (400/404/409/500) keep the standard handling from
planning.md §11.

---

## 7. Route summary (assistant-facing)

| Path | Access | Page | API used |
|---|---|---|---|
| `/register/assistant` | Public | RegisterAssistantPage | `POST /auth/register/assistant` |
| `/assistant/dashboard` | DOCTOR_ASSISTANT | AssistantDashboardPage | `GET /assistant/me/dashboard` |
| `/assistant/profile` | DOCTOR_ASSISTANT | AssistantProfilePage | `GET/PATCH /assistant/me` |
| `/assistant/doctor` | DOCTOR_ASSISTANT | AssignedDoctorPage | `GET /assistant/me/doctor` |
| `/assistant/requests` | DOCTOR_ASSISTANT | AppointmentRequestsPage | `GET /appointments/requests`, accept/reject |
| `/assistant/appointments` | DOCTOR_ASSISTANT | AllAppointmentsPage | `GET /appointments`, reschedule/cancel/status |
| `/assistant/appointments/:id` | DOCTOR_ASSISTANT | AppointmentDetailPage | `GET /appointments/:id` |
| `/assistant/queue` | DOCTOR_ASSISTANT | QueueManagementPage | `GET /queue/today`, call-next, status |
| `/admin/assistants` | ADMIN | AssistantsManagementPage | `GET /admin/assistants`, assign-doctor, suspend |

---

## 8. Build order (for opencode)

**Step A — Registration**
"Add `POST /auth/register/assistant` to `authApi.js`, create
`registerAssistantSchema` in `authValidation.js`, build
`RegisterAssistantPage.jsx` (fields: fullName, email, password, phone?,
designation?, no doctor selector), add the `/register/assistant` public
route, and link to it from LoginPage and LandingPage."

**Step B — Admin assistants list + endpoint rename**
"Add `getAssistants(params)` (`GET /admin/assistants`) to `adminApi.js` and a
`useAssistantsList` hook. Rename the assign mutation to call `PATCH
/admin/assistants/:id/assign-doctor` instead of `/assign`. Delete the
separate remove endpoint/hook — unassigning now means calling assign-doctor
with `{ doctorId: null }`. Update `AssistantsManagementPage.jsx` to render
the fetched list in a table with Pagination, and wire Assign/Unassign/Suspend
actions to the updated hooks."

**Step C — Empty states**
"Update `AssistantDashboardPage.jsx` and `AssignedDoctorPage.jsx` to show a
distinct 'No doctor assigned yet. Please contact the administrator.' message
when the backend indicates no doctor is assigned, instead of the generic
ErrorState."

**Step D — Scoped 403 messaging**
"In the assistant appointment and queue mutation hooks (accept/reject
request, reschedule, cancel-by-staff, status update, call-next, update queue
status), override the default 403 toast with 'This doesn't belong to your
assigned doctor.'"

---

## 9. Unchanged — no action needed

Confirmed still correct against the backend doc:
- `GET /assistant/me`, `PATCH /assistant/me`, `GET /assistant/me/dashboard`,
  `GET /assistant/me/doctor`
- `PATCH /admin/assistants/:id/suspend`
- Login flow — assistants use the same `POST /auth/login` as every other role
- All appointment/queue endpoint paths and request bodies themselves — only
  the authorization behavior around them changed (section 6)
