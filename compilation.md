# Compilation Log

Record of all work completed on the MediTrack frontend (`D:\1.1\Frontend\my-project\frontend`) up to the current session.

Scope: implementation of planning steps **15–18** in plain JavaScript (`.jsx`, no TypeScript) using Tailwind CSS, plus a full API-endpoint audit. All steps verified with `npm run lint` and `npm run build`.

---

## Step 15 — Nearby Doctors (Google Maps)

- `src/utils/maps.js` — helpers:
  - `getDoctorCoords(doctor)` — extracts coordinates from `latitude/longitude` or `lat/lng` or `location`.
  - `buildDirectionsUrl(doctor, origin)` — uses `directionsUrl` if present, else builds a `https://www.google.com/maps/dir/?api=1...` URL.
- `src/components/maps/NearbyDoctorsMap.jsx` — map component using `@react-google-maps/api` (`LoadScript` + `GoogleMap` + `Marker` + `InfoWindow`), custom SVG data-URI marker icons, and a static gradient fallback when the Google Maps API key is missing.
- `src/pages/patient/NearbyDoctorsPage.jsx` — page with browser geolocation and a filter bar (specialization + radius 5 / 10 / 25 / 50 km), keeping the list and map in sync.
- Verified: lint clean, build passes.

## Step 16 — AI Chatbot

- `src/api/chatbotApi.js` — `askChatbot(message)` (POST `/chatbot/ask`), `getChatbotHistory(params)` (GET `/chatbot/history`).
- `src/hooks/chatbot/useAskChatbot.js` — mutation hook wrapping `askChatbot`.
- `src/hooks/chatbot/useChatbotHistory.js` — query hook wrapping `getChatbotHistory`.
- `src/components/chatbot/UrgencyBadge.jsx` — urgency-level badge.
- `src/components/chatbot/ChatBubble.jsx` — chat bubble with suggestions, urgency indication, disclaimer, and retry support.
- `src/components/chatbot/ChatWindow.jsx` — chat window container.
- `src/pages/patient/ChatbotPage.jsx` — live chat page. On API 500 responses the user's message is kept as a retryable rose-coloured bubble and a toast is shown.
- `src/pages/patient/ChatbotHistoryPage.jsx` — history page with expandable conversations and pagination.
- Verified: lint passes, build passes (apostrophe/quoting parsing issue fixed along the way).

## Step 17 — Admin Module

- `src/api/adminApi.js` — dashboard, doctor moderation (pending / approve / reject with reason / suspend), user management (list, activate, suspend, delete), assistant management (assigned doctor, remove, suspend), reports, admin profile.
- `src/api/specializationApi.js` — specialization CRUD: list, create, update, delete.
- 14 query/mutation hooks in `src/hooks/admin/` backed by real `useQuery` / `useMutation`.
- 3 specialization mutations: `useCreateSpecialization`, `useUpdateSpecialization`, `useDeleteSpecialization`.
- 7 admin pages rewired to real hooks, with gradient hero headers, tables, modals, pagination, recharts, and CSV export.
- `src/components/common/ConfirmDialog.jsx` — extended to accept optional `children` (used for the doctor reject-reason textarea).
- Verified: lint passes, build passes (unused imports cleaned up).

## Step 18 — Polish pass (loading / empty / error states, responsive QA, colour-only status fix)

Audit output: all pages use real query hooks (only `src/pages/public/LandingPage.jsx` is a static marketing placeholder — acceptable, it renders no API data). Fixes applied:

- **`src/pages/patient/BookAppointmentPage.jsx`** — added loading / error handling for the schedule fetch:
  - error → red banner with a Retry button (`refetchSchedule`);
  - loading while a date is picked → inline `Spinner`;
  - otherwise the existing slot picker / empty message.
- **`src/pages/patient/PatientProfilePage.jsx`** — removed the render-time `setForm(...)` anti-pattern by moving form state initialisation into a child `ProfileForm` component that initialises its state once via `useState(() => formFrom(profile))` and only mounts after the profile data loads.
- **`src/pages/doctor/DoctorQueuePage.jsx`** — status circle icons now carry `aria-label` and `title` text, so colour is never the only status signal (the text `Badge` remains below).
- **`src/pages/doctor/DoctorProfileSettingsPage.jsx`** — removed the dead "Change photo" button (no backend upload support) and its now-unused `UploadCloud` import.
- **`src/pages/doctor/ClinicLocationPage.jsx`** — when coordinates exist an "Open in Maps" link renders above the static map panel (opens `https://www.google.com/maps/search/?api=1&query=lat,lng`); improved the empty-coordinates hint text.
- Verified: `npm run lint` clean, `npm run build` succeeds (only a pre-existing "chunks larger than 500 kB" warning).

## API endpoint audit (final output)

All HTTP calls live in `src/api/*.js` and go through `src/api/axiosInstance.js` (Bearer auth from Redux, `withCredentials`, automatic 401 refresh via POST `/auth/refresh-token` with request queueing). Base URL from `VITE_API_BASE_URL` (`http://localhost:5000/api/v1`). Response envelope everywhere: `{ success, statusCode, message, data, meta }`.

### Auth — `src/api/authApi.js`
| Method | Endpoint | Notes |
|---|---|---|
| POST | `/auth/login` | body |
| POST | `/auth/register/patient` | body |
| POST | `/auth/register/doctor` | body |
| POST | `/auth/logout` | |
| POST | `/auth/change-password` | body |
| POST | `/auth/forgot-password` | body |
| POST | `/auth/reset-password` | body |
| POST | `/auth/refresh-token` | interceptor + `src/app/bootstrap.js` |

### Doctors (public) — `src/api/doctorPublicApi.js`
- GET `/doctors` (params)
- GET `/doctors/:id`
- GET `/doctors/:id/reviews`
- GET `/doctors/:id/schedule`
- GET `/doctors/nearby` (lat/lng, radius, specialization params)

### Patients — `src/api/patientApi.js`
- GET `/patients/me/dashboard`
- GET `/patients/me`
- PATCH `/patients/me`

### Doctor (self) — `src/api/doctorApi.js`
- GET `/doctor/me`
- PATCH `/doctor/me`
- GET `/doctor/me/dashboard`
- GET `/doctor/me/schedule`
- POST `/doctor/me/schedule`
- PATCH `/doctor/me/schedule/:id`
- DELETE `/doctor/me/schedule/:id`
- PATCH `/doctor/me/clinic-location`
- GET `/doctor/me/patients/today`
- GET `/doctor/me/patients`
- GET `/doctor/me/reviews`

### Assistant — `src/api/assistantApi.js`
- GET `/assistant/me`
- PATCH `/assistant/me`
- GET `/assistant/me/dashboard`
- GET `/assistant/me/doctor`

### Admin — `src/api/adminApi.js`
- GET `/admin/dashboard`
- GET `/admin/doctors/pending`
- PATCH `/admin/doctors/:id/approve`
- PATCH `/admin/doctors/:id/reject` (body `{ reason }`)
- PATCH `/admin/doctors/:id/suspend`
- GET `/admin/users`
- PATCH `/admin/users/:id/activate`
- PATCH `/admin/users/:id/suspend`
- DELETE `/admin/users/:id`
- PATCH `/admin/assistants/:id/assign` (body `{ doctorId }`)
- PATCH `/admin/assistants/:id/remove`
- PATCH `/admin/assistants/:id/suspend`
- GET `/admin/reports`
- GET `/admin/me`
- PATCH `/admin/me`

### Appointments — `src/api/appointmentApi.js` + `src/api/appointmentRequestApi.js`
- POST `/appointments`
- GET `/appointments/my`
- GET `/appointments/:id`
- PATCH `/appointments/:id/cancel`
- PATCH `/appointments/:id/reschedule`
- GET `/appointments` (all/staff view)
- PATCH `/appointments/:id/cancel-by-staff`
- PATCH `/appointments/:id/status`
- GET `/appointments/requests`
- PATCH `/appointments/:id/accept`
- PATCH `/appointments/:id/reject` (body `{ reason }`)

### Queue — `src/api/queueApi.js`
- GET `/queue/my`
- GET `/queue/today` (query `{ doctorId }`)
- PATCH `/queue/:id/call-next`
- PATCH `/queue/:id/status`

### Reviews — `src/api/reviewApi.js`
- GET `/reviews/my`
- GET `/reviews`
- POST `/reviews`
- PATCH `/reviews/:id`
- DELETE `/reviews/:id`

### Notifications — `src/api/notificationApi.js`
- GET `/notifications` (`{ page, limit }`)
- PATCH `/notifications/:id/read`
- PATCH `/notifications/read-all`
- DELETE `/notifications/:id`

### Chatbot — `src/api/chatbotApi.js`
- POST `/chatbot/ask` (body `{ message }`)
- GET `/chatbot/history`

### Specializations — `src/api/specializationApi.js`
- GET `/specializations`
- POST `/specializations`
- PATCH `/specializations/:id`
- DELETE `/specializations/:id`

---

## Environment / conventions

- `VITE_API_BASE_URL=http://localhost:5000/api/v1`
- `VITE_GOOGLE_MAPS_API_KEY=` (currently empty; interactive map features show static fallbacks until a key is provided).
- Tailwind brand tokens: `brand` (indigo palette), `teal` 400/500, `bg-brand-gradient` = `linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #14b8a6 100%)`.
- ESLint enforces `react-hooks/set-state-in-effect` (no synchronous `setState` in effects) and `no-unused-vars`; single-quoted strings must not contain unescaped apostrophes.

## Verification status

- `npm run lint` — clean (ESLint over the whole project).
- `npm run build` — succeeds; only recurring warning is the pre-existing large-chunk (>500 kB) notice, not an error.