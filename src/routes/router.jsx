import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import PublicLayout from '@/layouts/PublicLayout';
import PatientLayout from '@/layouts/PatientLayout';
import DoctorLayout from '@/layouts/DoctorLayout';
import AssistantLayout from '@/layouts/AssistantLayout';
import AdminLayout from '@/layouts/AdminLayout';

import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/public/LoginPage';
import RegisterPatientPage from '@/pages/public/RegisterPatientPage';
import RegisterDoctorPage from '@/pages/public/RegisterDoctorPage';
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/public/ResetPasswordPage';
import FindDoctorsPage from '@/pages/public/FindDoctorsPage';
import DoctorProfilePage from '@/pages/public/DoctorProfilePage';
import NotFoundPage from '@/pages/public/NotFoundPage';
import ForbiddenPage from '@/pages/public/ForbiddenPage';

import PatientDashboardPage from '@/pages/patient/PatientDashboardPage';
import PatientProfilePage from '@/pages/patient/PatientProfilePage';
import NearbyDoctorsPage from '@/pages/patient/NearbyDoctorsPage';
import BookAppointmentPage from '@/pages/patient/BookAppointmentPage';
import MyAppointmentsPage from '@/pages/patient/MyAppointmentsPage';
import PatientAppointmentDetailPage from '@/pages/patient/AppointmentDetailPage';
import MyQueuePage from '@/pages/patient/MyQueuePage';
import MyReviewsPage from '@/pages/patient/MyReviewsPage';
import ChatbotPage from '@/pages/patient/ChatbotPage';
import ChatbotHistoryPage from '@/pages/patient/ChatbotHistoryPage';

import DoctorDashboardPage from '@/pages/doctor/DoctorDashboardPage';
import DoctorProfileSettingsPage from '@/pages/doctor/DoctorProfileSettingsPage';
import DoctorSchedulePage from '@/pages/doctor/DoctorSchedulePage';
import ClinicLocationPage from '@/pages/doctor/ClinicLocationPage';
import TodaysPatientsPage from '@/pages/doctor/TodaysPatientsPage';
import DoctorPatientsPage from '@/pages/doctor/DoctorPatientsPage';
import DoctorReviewsPage from '@/pages/doctor/DoctorReviewsPage';
import DoctorQueuePage from '@/pages/doctor/DoctorQueuePage';

import AssistantDashboardPage from '@/pages/assistant/AssistantDashboardPage';
import AssistantProfilePage from '@/pages/assistant/AssistantProfilePage';
import AssignedDoctorPage from '@/pages/assistant/AssignedDoctorPage';
import AppointmentRequestsPage from '@/pages/assistant/AppointmentRequestsPage';
import AllAppointmentsPage from '@/pages/assistant/AllAppointmentsPage';
import AssistantAppointmentDetailPage from '@/pages/assistant/AppointmentDetailPage';
import QueueManagementPage from '@/pages/assistant/QueueManagementPage';

import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import PendingDoctorsPage from '@/pages/admin/PendingDoctorsPage';
import UsersManagementPage from '@/pages/admin/UsersManagementPage';
import AssistantsManagementPage from '@/pages/admin/AssistantsManagementPage';
import ReviewsModerationPage from '@/pages/admin/ReviewsModerationPage';
import SpecializationsPage from '@/pages/admin/SpecializationsPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import AdminProfilePage from '@/pages/admin/AdminProfilePage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register/patient', element: <RegisterPatientPage /> },
      { path: '/register/doctor', element: <RegisterDoctorPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/doctors', element: <FindDoctorsPage /> },
      { path: '/doctors/:id', element: <DoctorProfilePage /> },
      { path: '/forbidden', element: <ForbiddenPage /> },
    ],
  },
  {
    path: '/patient',
    element: (
      <ProtectedRoute allowedRoles={['PATIENT']}>
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/patient/dashboard" replace /> },
      { path: 'dashboard', element: <PatientDashboardPage /> },
      { path: 'profile', element: <PatientProfilePage /> },
      { path: 'doctors/nearby', element: <NearbyDoctorsPage /> },
      { path: 'book/:doctorId', element: <BookAppointmentPage /> },
      { path: 'appointments', element: <MyAppointmentsPage /> },
      { path: 'appointments/:id', element: <PatientAppointmentDetailPage /> },
      { path: 'queue', element: <MyQueuePage /> },
      { path: 'reviews', element: <MyReviewsPage /> },
      { path: 'chatbot', element: <ChatbotPage /> },
      { path: 'chatbot/history', element: <ChatbotHistoryPage /> },
    ],
  },
  {
    path: '/doctor',
    element: (
      <ProtectedRoute allowedRoles={['DOCTOR']}>
        <DoctorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/doctor/dashboard" replace /> },
      { path: 'dashboard', element: <DoctorDashboardPage /> },
      { path: 'profile', element: <DoctorProfileSettingsPage /> },
      { path: 'schedule', element: <DoctorSchedulePage /> },
      { path: 'clinic-location', element: <ClinicLocationPage /> },
      { path: 'patients/today', element: <TodaysPatientsPage /> },
      { path: 'patients', element: <DoctorPatientsPage /> },
      { path: 'reviews', element: <DoctorReviewsPage /> },
      { path: 'queue', element: <DoctorQueuePage /> },
    ],
  },
  {
    path: '/assistant',
    element: (
      <ProtectedRoute allowedRoles={['DOCTOR_ASSISTANT']}>
        <AssistantLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/assistant/dashboard" replace /> },
      { path: 'dashboard', element: <AssistantDashboardPage /> },
      { path: 'profile', element: <AssistantProfilePage /> },
      { path: 'doctor', element: <AssignedDoctorPage /> },
      { path: 'requests', element: <AppointmentRequestsPage /> },
      { path: 'appointments', element: <AllAppointmentsPage /> },
      { path: 'appointments/:id', element: <AssistantAppointmentDetailPage /> },
      { path: 'queue', element: <QueueManagementPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'doctors/pending', element: <PendingDoctorsPage /> },
      { path: 'users', element: <UsersManagementPage /> },
      { path: 'assistants', element: <AssistantsManagementPage /> },
      { path: 'reviews', element: <ReviewsModerationPage /> },
      { path: 'specializations', element: <SpecializationsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'profile', element: <AdminProfilePage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);