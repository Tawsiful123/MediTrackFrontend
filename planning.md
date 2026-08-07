# Meditrack — Frontend Planning

**Stack:** React + Vite + **JavaScript** (no TypeScript)
**Styling:** Tailwind CSS
**Routing:** React Router v6
**Server state:** TanStack Query (React Query)
**Client/global state:** Redux Toolkit (auth + UI state only — server data stays in React Query)
**Forms + validation:** React Hook Form + Zod (`@hookform/resolvers/zod`) — reuses the same validation *shape* as the backend zod schemas, written in plain `.js`
**HTTP client:** Axios (with interceptor for token refresh)
**Maps:** Google Maps JavaScript API / `@react-google-maps/api` (for Nearby Doctors)
**Notifications (toast):** react-hot-toast
**Icons:** lucide-react
**Backed by:** [Meditrack API Documentation](#) — all endpoints, roles, and response shapes referenced below come from that doc.

> This project intentionally uses plain JavaScript, not TypeScript. No `.ts`/`.tsx` files, no `interface`/`type` declarations — use JSDoc comments where extra clarity helps, but nothing is type-checked at build time.

---

## 1. Why this stack

- **Vite** — fast dev server + HMR, minimal config, first-class JS (no TS boilerplate to strip out).
- **React Query** — the API surface is heavily list/pagination/detail-driven (doctors, appointments, queue, reviews, notifications). React Query gives caching, refetching, and pagination handling for free, and pairs naturally with the `meta: {page, limit, total}` envelope the API returns.
- **Redux Toolkit** — kept deliberately small: only `auth` (current user, role, accessToken) and light `ui` state (sidebar open/closed, active modal). Everything else (doctors list, appointments, queue) is server state and lives in React Query, not Redux — avoids duplicating cache logic.
- **React Hook Form + Zod** — matches the backend's validation approach conceptually (zod), so error messages and field rules can be kept in sync between frontend and backend without relearning a second validation library.
- **Role-based routing** — four roles (`PATIENT`, `DOCTOR`, `DOCTOR_ASSISTANT`, `ADMIN`) each get their own route tree and layout shell, gated by a `<ProtectedRoute>` wrapper reading role off the Redux auth slice.

---

## 2. Project Folder Structure

```
meditrack-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                      # Tailwind directives + base styles
│   │
│   ├── app/
│   │   ├── store.js                   # Redux Toolkit store
│   │   └── queryClient.js             # React Query client config
│   │
│   ├── api/
│   │   ├── axiosInstance.js           # base axios instance + interceptors (token refresh, 401 handling)
│   │   ├── authApi.js
│   │   ├── patientApi.js
│   │   ├── doctorApi.js
│   │   ├── doctorPublicApi.js         # /doctors browse endpoints
│   │   ├── appointmentApi.js
│   │   ├── appointmentRequestApi.js
│   │   ├── queueApi.js
│   │   ├── reviewApi.js
│   │   ├── chatbotApi.js
│   │   ├── assistantApi.js
│   │   ├── adminApi.js
│   │   ├── specializationApi.js
│   │   └── notificationApi.js
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.js           # Redux slice: user, role, accessToken, isAuthenticated
│   │   │   ├── useAuth.js             # hook wrapping selectors + login/logout actions
│   │   │   └── ProtectedRoute.jsx
│   │   └── ui/
│   │       └── uiSlice.js             # sidebar, modals, theme
│   │
│   ├── hooks/                         # React Query hooks, grouped by domain
│   │   ├── auth/
│   │   │   ├── useLogin.js
│   │   │   ├── useRegisterPatient.js
│   │   │   ├── useRegisterDoctor.js
│   │   │   ├── useLogout.js
│   │   │   ├── useChangePassword.js
│   │   │   ├── useForgotPassword.js
│   │   │   └── useResetPassword.js
│   │   ├── patient/
│   │   │   ├── usePatientProfile.js
│   │   │   ├── useUpdatePatientProfile.js
│   │   │   └── usePatientDashboard.js
│   │   ├── doctors/
│   │   │   ├── useDoctorsList.js
│   │   │   ├── useNearbyDoctors.js
│   │   │   ├── useDoctorDetail.js
│   │   │   ├── useDoctorSchedule.js
│   │   │   └── useDoctorReviews.js
│   │   ├── doctorSelf/
│   │   │   ├── useDoctorProfile.js
│   │   │   ├── useUpdateDoctorProfile.js
│   │   │   ├── useDoctorDashboard.js
│   │   │   ├── useDoctorSchedules.js
│   │   │   ├── useCreateSchedule.js
│   │   │   ├── useUpdateSchedule.js
│   │   │   ├── useDeleteSchedule.js
│   │   │   ├── useUpdateClinicLocation.js
│   │   │   ├── useTodaysPatients.js
│   │   │   └── useDoctorPatients.js
│   │   ├── appointments/
│   │   │   ├── useBookAppointment.js
│   │   │   ├── useMyAppointments.js
│   │   │   ├── useAppointmentDetail.js
│   │   │   ├── useCancelAppointment.js
│   │   │   ├── useAllAppointments.js    # assistant/admin
│   │   │   ├── useRescheduleAppointment.js
│   │   │   ├── useCancelByStaff.js
│   │   │   ├── useUpdateAppointmentStatus.js
│   │   │   ├── useAppointmentRequests.js
│   │   │   ├── useAcceptRequest.js
│   │   │   └── useRejectRequest.js
│   │   ├── queue/
│   │   │   ├── useMyQueue.js
│   │   │   ├── useTodayQueue.js
│   │   │   ├── useCallNext.js
│   │   │   └── useUpdateQueueStatus.js
│   │   ├── reviews/
│   │   │   ├── useCreateReview.js
│   │   │   ├── useUpdateReview.js
│   │   │   ├── useDeleteReview.js
│   │   │   ├── useMyReviews.js
│   │   │   └── useAllReviews.js         # admin
│   │   ├── chatbot/
│   │   │   ├── useAskChatbot.js
│   │   │   └── useChatbotHistory.js
│   │   ├── assistant/
│   │   │   ├── useAssistantProfile.js
│   │   │   ├── useUpdateAssistantProfile.js
│   │   │   ├── useAssistantDashboard.js
│   │   │   └── useAssignedDoctor.js
│   │   ├── admin/
│   │   │   ├── useAdminDashboard.js
│   │   │   ├── usePendingDoctors.js
│   │   │   ├── useApproveDoctor.js
│   │   │   ├── useRejectDoctor.js
│   │   │   ├── useSuspendDoctor.js
│   │   │   ├── useUsersList.js
│   │   │   ├── useActivateUser.js
│   │   │   ├── useSuspendUser.js
│   │   │   ├── useDeleteUser.js
│   │   │   ├── useAssignAssistant.js
│   │   │   ├── useRemoveAssistant.js
│   │   │   ├── useSuspendAssistant.js
│   │   │   ├── useAdminReports.js
│   │   │   └── useAdminProfile.js
│   │   ├── specializations/
│   │   │   ├── useSpecializations.js
│   │   │   ├── useCreateSpecialization.js
│   │   │   ├── useUpdateSpecialization.js
│   │   │   └── useDeleteSpecialization.js
│   │   └── notifications/
│   │       ├── useNotifications.js
│   │       ├── useMarkAsRead.js
│   │       ├── useMarkAllAsRead.js
│   │       └── useDeleteNotification.js
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx           # navbar + footer, for landing/browse/auth pages
│   │   ├── PatientLayout.jsx          # sidebar + topbar for patient dashboard area
│   │   ├── DoctorLayout.jsx
│   │   ├── AssistantLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPatientPage.jsx
│   │   │   ├── RegisterDoctorPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── FindDoctorsPage.jsx        # GET /doctors (search/filter/sort)
│   │   │   ├── DoctorProfilePage.jsx      # GET /doctors/:id (+ schedule + reviews)
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── patient/
│   │   │   ├── PatientDashboardPage.jsx
│   │   │   ├── PatientProfilePage.jsx
│   │   │   ├── NearbyDoctorsPage.jsx
│   │   │   ├── BookAppointmentPage.jsx
│   │   │   ├── MyAppointmentsPage.jsx
│   │   │   ├── AppointmentDetailPage.jsx
│   │   │   ├── MyQueuePage.jsx
│   │   │   ├── MyReviewsPage.jsx
│   │   │   ├── ChatbotPage.jsx
│   │   │   └── ChatbotHistoryPage.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── DoctorDashboardPage.jsx
│   │   │   ├── DoctorProfileSettingsPage.jsx
│   │   │   ├── DoctorSchedulePage.jsx
│   │   │   ├── ClinicLocationPage.jsx
│   │   │   ├── TodaysPatientsPage.jsx
│   │   │   ├── DoctorPatientsPage.jsx
│   │   │   ├── DoctorReviewsPage.jsx
│   │   │   └── DoctorQueuePage.jsx        # read-only queue view
│   │   │
│   │   ├── assistant/
│   │   │   ├── AssistantDashboardPage.jsx
│   │   │   ├── AssistantProfilePage.jsx
│   │   │   ├── AssignedDoctorPage.jsx
│   │   │   ├── AppointmentRequestsPage.jsx
│   │   │   ├── AllAppointmentsPage.jsx
│   │   │   ├── QueueManagementPage.jsx
│   │   │   └── AppointmentDetailPage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboardPage.jsx
│   │       ├── PendingDoctorsPage.jsx
│   │       ├── UsersManagementPage.jsx
│   │       ├── AssistantsManagementPage.jsx
│   │       ├── ReviewsModerationPage.jsx
│   │       ├── SpecializationsPage.jsx
│   │       ├── ReportsPage.jsx
│   │       └── AdminProfilePage.jsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── TextArea.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Badge.jsx              # status pills: PENDING/CONFIRMED/etc.
│   │   │   ├── Avatar.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── doctors/
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── DoctorFilterBar.jsx
│   │   │   ├── ScheduleTable.jsx
│   │   │   ├── SlotPicker.jsx
│   │   │   └── ReviewList.jsx
│   │   ├── appointments/
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── AppointmentStatusBadge.jsx
│   │   │   ├── AppointmentTable.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── RescheduleModal.jsx
│   │   │   └── CancelModal.jsx
│   │   ├── queue/
│   │   │   ├── QueueBoard.jsx
│   │   │   ├── QueueRow.jsx
│   │   │   └── QueuePositionCard.jsx
│   │   ├── reviews/
│   │   │   ├── ReviewForm.jsx
│   │   │   └── ReviewCard.jsx
│   │   ├── chatbot/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   └── UrgencyBadge.jsx
│   │   ├── notifications/
│   │   │   └── NotificationItem.jsx
│   │   └── maps/
│   │       └── NearbyDoctorsMap.jsx
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── formatCurrency.js
│   │   ├── getInitials.js
│   │   ├── roleRedirect.js            # maps role → default dashboard path
│   │   └── constants.js               # enums mirrored from API doc §17
│   │
│   ├── validations/                    # zod schemas, plain .js (no TS types)
│   │   ├── authValidation.js
│   │   ├── patientValidation.js
│   │   ├── doctorValidation.js
│   │   ├── appointmentValidation.js
│   │   ├── reviewValidation.js
│   │   └── scheduleValidation.js
│   │
│   ├── routes/
│   │   └── router.jsx                 # createBrowserRouter tree, role-gated
│   │
│   └── assets/
│       └── images/
│
├── .env                                # VITE_API_BASE_URL, VITE_GOOGLE_MAPS_API_KEY
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── jsconfig.json                       # path aliases (@/components, @/hooks, etc.) — JS, not tsconfig
```

---

## 3. Core Packages

| Purpose | Package |
|---|---|
| Build tool | `vite`, `@vitejs/plugin-react` |
| Routing | `react-router-dom` |
| Server state | `@tanstack/react-query`, `@tanstack/react-query-devtools` |
| Global state | `@reduxjs/toolkit`, `react-redux` |
| HTTP | `axios` |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` |
| Styling | `tailwindcss`, `postcss`, `autoprefixer` |
| Icons | `lucide-react` |
| Toasts | `react-hot-toast` |
| Maps | `@react-google-maps/api` |
| Dates | `date-fns` |
| Charts (admin reports) | `recharts` |

No `typescript`, `ts-node`, `@types/*`, or `.tsx` files anywhere in the project.

---

## 4. Environment Variables (`.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_MAPS_API_KEY=
```

---

## 5. Auth Flow

1. **Login** (`POST /auth/login`) → response gives `accessToken` in JSON body; refresh token arrives as an httpOnly cookie (frontend never touches it directly — `axios` must be configured with `withCredentials: true`).
2. `accessToken` is stored in the Redux `auth` slice (in-memory, **not** localStorage, to reduce XSS token-theft risk) and attached by the axios request interceptor as `Authorization: Bearer <token>`.
3. **On page refresh:** since the access token lives only in memory, call `POST /auth/refresh-token` once on app bootstrap (cookie is sent automatically) to silently re-establish a session; if it 401s, treat the user as logged out and redirect to `/login`.
4. **On any 401 response** (except from `/auth/login` and `/auth/refresh-token` themselves): axios response interceptor calls `/auth/refresh-token` once, retries the original request with the new token, and if that also fails, dispatches logout and redirects to `/login`.
5. **On 403 (role mismatch):** show a "not authorized" page/toast — do not treat as logout.
6. `needsPasswordChange: true` from login response → redirect straight to a forced change-password screen before allowing access to the rest of the app.
7. **Logout:** call `POST /auth/logout`, clear Redux auth state, clear React Query cache (`queryClient.clear()`), redirect to `/login`.

```js
// src/utils/roleRedirect.js
export const roleRedirect = {
  PATIENT: '/patient/dashboard',
  DOCTOR: '/doctor/dashboard',
  DOCTOR_ASSISTANT: '/assistant/dashboard',
  ADMIN: '/admin/dashboard',
};
```

---

## 6. Route Map (role-gated)

`<ProtectedRoute allowedRoles={[...]}>` wraps each role's route tree; unauthenticated users are redirected to `/login`, authenticated-but-wrong-role users are redirected to a `/forbidden` page.

### Public routes
| Path | Page | API used |
|---|---|---|
| `/` | LandingPage | — |
| `/login` | LoginPage | `POST /auth/login` |
| `/register/patient` | RegisterPatientPage | `POST /auth/register/patient` |
| `/register/doctor` | RegisterDoctorPage | `POST /auth/register/doctor`, `GET /specializations` |
| `/forgot-password` | ForgotPasswordPage | `POST /auth/forgot-password` |
| `/reset-password` | ResetPasswordPage | `POST /auth/reset-password` |
| `/doctors` | FindDoctorsPage | `GET /doctors` |
| `/doctors/:id` | DoctorProfilePage | `GET /doctors/:id`, `GET /doctors/:id/schedule`, `GET /doctors/:id/reviews` |
| `/forbidden` | ForbiddenPage | — |
| `*` | NotFoundPage | — |

### Patient routes (`allowedRoles: ['PATIENT']`)
| Path | Page | API used |
|---|---|---|
| `/patient/dashboard` | PatientDashboardPage | `GET /patients/me/dashboard` |
| `/patient/profile` | PatientProfilePage | `GET /patients/me`, `PATCH /patients/me` |
| `/patient/doctors/nearby` | NearbyDoctorsPage | `GET /doctors/nearby` |
| `/patient/book/:doctorId` | BookAppointmentPage | `GET /doctors/:id/schedule`, `POST /appointments` |
| `/patient/appointments` | MyAppointmentsPage | `GET /appointments/my` |
| `/patient/appointments/:id` | AppointmentDetailPage | `GET /appointments/:id`, `PATCH /appointments/:id/cancel` |
| `/patient/queue` | MyQueuePage | `GET /queue/my` |
| `/patient/reviews` | MyReviewsPage | `GET /reviews/my`, `POST /reviews`, `PATCH /reviews/:id`, `DELETE /reviews/:id` |
| `/patient/chatbot` | ChatbotPage | `POST /chatbot/ask` |
| `/patient/chatbot/history` | ChatbotHistoryPage | `GET /chatbot/history` |

### Doctor routes (`allowedRoles: ['DOCTOR']`)
| Path | Page | API used |
|---|---|---|
| `/doctor/dashboard` | DoctorDashboardPage | `GET /doctor/me/dashboard` |
| `/doctor/profile` | DoctorProfileSettingsPage | `GET /doctor/me`, `PATCH /doctor/me` |
| `/doctor/schedule` | DoctorSchedulePage | `GET/POST/PATCH/DELETE /doctor/me/schedule` |
| `/doctor/clinic-location` | ClinicLocationPage | `PATCH /doctor/me/clinic-location` |
| `/doctor/patients/today` | TodaysPatientsPage | `GET /doctor/me/patients/today` |
| `/doctor/patients` | DoctorPatientsPage | `GET /doctor/me/patients` |
| `/doctor/reviews` | DoctorReviewsPage | `GET /doctor/me/reviews` |
| `/doctor/queue` | DoctorQueuePage | `GET /queue/today` |

### Doctor Assistant routes (`allowedRoles: ['DOCTOR_ASSISTANT']`)
| Path | Page | API used |
|---|---|---|
| `/assistant/dashboard` | AssistantDashboardPage | `GET /assistant/me/dashboard` |
| `/assistant/profile` | AssistantProfilePage | `GET /assistant/me`, `PATCH /assistant/me` |
| `/assistant/doctor` | AssignedDoctorPage | `GET /assistant/me/doctor` |
| `/assistant/requests` | AppointmentRequestsPage | `GET /appointments/requests`, `PATCH .../accept`, `PATCH .../reject` |
| `/assistant/appointments` | AllAppointmentsPage | `GET /appointments`, `PATCH .../reschedule`, `PATCH .../cancel-by-staff`, `PATCH .../status` |
| `/assistant/appointments/:id` | AppointmentDetailPage | `GET /appointments/:id` |
| `/assistant/queue` | QueueManagementPage | `GET /queue/today`, `PATCH /queue/:id/call-next`, `PATCH /queue/:id/status` |

### Admin routes (`allowedRoles: ['ADMIN']`)
| Path | Page | API used |
|---|---|---|
| `/admin/dashboard` | AdminDashboardPage | `GET /admin/dashboard` |
| `/admin/doctors/pending` | PendingDoctorsPage | `GET /admin/doctors/pending`, `PATCH .../approve`, `PATCH .../reject` |
| `/admin/users` | UsersManagementPage | `GET /admin/users`, `PATCH .../activate`, `PATCH .../suspend`, `DELETE /admin/users/:id`, `PATCH /admin/doctors/:id/suspend` |
| `/admin/assistants` | AssistantsManagementPage | `PATCH /admin/assistants/:id/assign`, `PATCH .../remove`, `PATCH .../suspend` |
| `/admin/reviews` | ReviewsModerationPage | `GET /reviews`, `DELETE /reviews/:id` |
| `/admin/specializations` | SpecializationsPage | `GET/POST/PATCH/DELETE /specializations` |
| `/admin/reports` | ReportsPage | `GET /admin/reports` |
| `/admin/profile` | AdminProfilePage | `GET /admin/me`, `PATCH /admin/me` |

All authenticated roles also get: **Notifications** panel (`GET /notifications`, `PATCH /:id/read`, `PATCH /read-all`, `DELETE /:id`) rendered from `NotificationBell.jsx` in the top bar of every layout, and **Change Password** reachable from a shared account menu (`POST /auth/change-password`).

---

## 7. React Query Conventions

- **Query keys** are arrays scoped by domain and params, e.g. `['doctors', { search, specialization, sortBy, page }]`, `['appointment', appointmentId]`, `['queue', 'today', doctorId]`.
- **Pagination:** every list hook accepts `{ page, limit, ...filters }` and returns `{ data, meta }` straight from the API envelope — components read `meta.total` to drive `<Pagination />`.
- **Mutations** (`useMutation`) call `queryClient.invalidateQueries` for the relevant list key(s) on success — e.g. accepting an appointment request invalidates both `['appointmentRequests']` and `['appointments']`.
- **Polling for live views:** `useTodayQueue` and `DoctorDashboardPage`'s `todayQueue` use `refetchInterval` (e.g. 10–15s) so the queue board stays current without a websocket layer in v1.
- **Optimistic updates** are used sparingly — only for low-risk, easily-reversible actions like marking a single notification as read.

Example hook shape (plain JS, JSDoc for clarity, no TS):

```js
// src/hooks/doctors/useDoctorsList.js
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/api/doctorPublicApi';

/**
 * @param {{ search?: string, specialization?: string, sortBy?: string, page?: number, limit?: number }} params
 */
export function useDoctorsList(params) {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => getDoctors(params),
    keepPreviousData: true,
  });
}
```

```js
// src/api/doctorPublicApi.js
import axiosInstance from './axiosInstance';

export async function getDoctors(params) {
  const { data } = await axiosInstance.get('/doctors', { params });
  return data; // { success, statusCode, message, meta, data }
}
```

---

## 8. Axios Instance & Interceptors

```js
// src/api/axiosInstance.js
import axios from 'axios';
import { store } from '@/app/store';
import { logout, setAccessToken } from '@/features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh-token');

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axiosInstance.post('/auth/refresh-token');
          store.dispatch(setAccessToken(data.data.accessToken));
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 9. Redux Auth Slice (minimal, no server data)

```js
// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,          // { id, fullName, email, role }
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## 10. Validation Layer (Zod, plain JS)

Mirrors the request bodies documented in the API doc, kept in plain `.js` files (no TS types — Zod infers shapes at runtime, which is all we need without TypeScript).

```js
// src/validations/authValidation.js
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerPatientSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const registerDoctorSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  specializationId: z.string().min(1, 'Select a specialization'),
  hospitalName: z.string().optional(),
  clinicAddress: z.string().optional(),
  consultationFee: z.number().positive('Fee must be greater than 0'),
});
```

```js
// src/validations/reviewValidation.js
import { z } from 'zod';

export const reviewSchema = z.object({
  appointmentId: z.string().min(1),
  rating: z.number().int().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  comment: z.string().max(500, 'Comment is too long').optional(),
});
```

Usage with React Hook Form:

```jsx
// inside LoginPage.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validations/authValidation';

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm({ resolver: zodResolver(loginSchema) });
```

---

## 11. Error & Status Handling (mapped to API doc §"Common status codes")

| Status | Frontend behavior |
|---|---|
| `400` | Show field-level errors from `errorMessages[]` next to the relevant form field; fall back to a toast if the error isn't tied to a known field. |
| `401` | Handled by axios interceptor (silent refresh + retry); if refresh also fails, force logout + redirect to `/login` with a "session expired" toast. |
| `403` | Toast: "You don't have permission to do that" + redirect to `/forbidden` for full-page navigations, or just a toast for inline actions (e.g. trying to cancel someone else's appointment). |
| `404` | Render `<EmptyState />` / `<ErrorState />` in-page for detail views (e.g. doctor not found); toast for action-based 404s. |
| `409` | Toast with the exact `message` from the API (e.g. "This time slot is already booked") — these are usually actionable/self-explanatory. |
| `500` | Generic toast: "Something went wrong, please try again" + optional retry button; log to console in dev. |

A shared `getErrorMessage(error)` util in `src/utils/` extracts `error.response.data.message` / `errorMessages` consistently for use in toasts and form-level errors.

---

## 12. Enum Constants (mirrors API doc §17)

```js
// src/utils/constants.js
export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  DOCTOR_ASSISTANT: 'DOCTOR_ASSISTANT',
  ADMIN: 'ADMIN',
};

export const ACCOUNT_STATUS = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

export const DOCTOR_VERIFICATION_STATUS = ['PENDING', 'APPROVED', 'REJECTED'];

export const APPOINTMENT_STATUS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'];

export const QUEUE_STATUS = ['WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED', 'ABSENT', 'SKIPPED'];

export const GENDER = ['MALE', 'FEMALE', 'OTHER'];

export const WEEKDAYS = [
  'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY',
];

// Badge color mapping used by <Badge /> and <AppointmentStatusBadge />
export const STATUS_COLORS = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'gray',
  REJECTED: 'red',
  WAITING: 'yellow',
  CALLED: 'blue',
  IN_CONSULTATION: 'purple',
  ABSENT: 'red',
  SKIPPED: 'gray',
  ACTIVE: 'green',
  INACTIVE: 'gray',
  SUSPENDED: 'red',
  APPROVED: 'green',
};
```

---

## 13. Key UI Flows

### 13.1 Patient books an appointment
1. `FindDoctorsPage` → `useDoctorsList` (search/specialization/sortBy) → `DoctorCard` grid.
2. Click a doctor → `DoctorProfilePage` → `useDoctorDetail` + `useDoctorReviews`.
3. Click "Book" → `BookAppointmentPage` → `useDoctorSchedule(doctorId, date)` renders `<SlotPicker />` from `availableSlots`/`bookedSlots`.
4. Submit → `useBookAppointment` (`POST /appointments`) → on `409` (slot taken), refetch schedule and show a toast so the picker updates live; on success, redirect to `MyAppointmentsPage` with a confirmation toast.

### 13.2 Assistant manages the queue
1. `QueueManagementPage` → `useTodayQueue(doctorId)` with `refetchInterval` polling.
2. `<QueueBoard />` renders `<QueueRow />` per entry with action buttons (`Call Next`, status dropdown).
3. `Call Next` → `useCallNext` (`PATCH /queue/:id/call-next`) → invalidates `['queue', 'today']`.
4. Status dropdown → `useUpdateQueueStatus` (`PATCH /queue/:id/status`).

### 13.3 Admin approves a doctor
1. `PendingDoctorsPage` → `usePendingDoctors` (`GET /admin/doctors/pending`).
2. Row action `Approve` → `useApproveDoctor` (`PATCH /admin/doctors/:id/approve`) → invalidates `['pendingDoctors']` and `['adminDashboard']`.
3. Row action `Reject` → opens `<ConfirmDialog />` requiring a `reason`, then `useRejectDoctor` (`PATCH /admin/doctors/:id/reject`).

### 13.4 Patient uses the AI chatbot
1. `ChatbotPage` → `<ChatWindow />` local component state holds message list.
2. Submit symptom text → `useAskChatbot` (`POST /chatbot/ask`) → append `suggestions` + `<UrgencyBadge urgencyLevel />` + disclaimer text to the chat window.
3. On `500` (LLM failure), show a toast and keep the user's typed message so they can retry without retyping.

### 13.5 Notifications (all roles)
1. `NotificationBell` in every layout topbar → `useNotifications({ page: 1, limit: 10 })`, polled every ~30s or refetched on window focus.
2. Unread count badge derived from `data.filter(n => !n.isRead).length` (or a dedicated unread count if the API adds one later).
3. Click a notification → `useMarkAsRead` (`PATCH /notifications/:id/read`) → invalidate `['notifications']`.
4. "Mark all as read" → `useMarkAllAsRead` (`PATCH /notifications/read-all`).

---

## 14. Responsive & Accessibility Notes

- Mobile-first Tailwind breakpoints; sidebar layouts (`DoctorLayout`, `AssistantLayout`, `AdminLayout`) collapse to a bottom nav or hamburger drawer under `md`.
- All interactive elements from `common/` (Button, Input, Select, Modal) are built with semantic HTML and visible focus states.
- Status badges use both color and text (never color alone) to convey `AppointmentStatus`/`QueueStatus`.
- Queue board (`QueueBoard.jsx`) and dashboards use `aria-live="polite"` regions where content updates via polling, so screen readers announce changes.

---

## 15. Suggested Build Order (Milestones)

1. Project scaffold — Vite + React (JS template), Tailwind, ESLint (JS config, no TS rules), folder structure, path aliases via `jsconfig.json`.
2. Axios instance + React Query provider + Redux store wiring.
3. Auth pages + flow — login, register (patient/doctor), forgot/reset password, protected routing, role redirect.
4. Shared component library (`common/`, `layout/`) — Button, Input, Modal, Badge, Pagination, Navbar, Sidebar, NotificationBell.
5. Public doctor browse — Find Doctors, Doctor Profile, schedule/reviews display.
6. Patient module — profile, dashboard, booking flow, my appointments, cancel flow.
7. Queue (patient view) + notifications wiring across all layouts.
8. Doctor module — profile, dashboard, schedule CRUD, clinic location, patients list, reviews.
9. Assistant module — requests, all appointments, reschedule/cancel/status, queue management.
10. Reviews — create/edit/delete (patient), moderation (admin).
11. Nearby doctors — Google Maps integration.
12. AI Chatbot UI + history.
13. Admin module — dashboard, doctor approvals, user management, assistant assignment, specializations CRUD, reports (charts via recharts).
14. Polish pass — loading/empty/error states everywhere, responsive QA, accessibility pass.
15. Testing (React Testing Library + Vitest, still plain JS) and deployment.

---

## 16. Explicitly Out of Scope for v1 (flagged for later)

- Real-time updates via WebSockets/SSE (queue and notifications use polling for v1, per §13.2 and §13.5).
- TypeScript migration.
- Native mobile app — this plan targets responsive web only.
- Offline support / PWA caching.