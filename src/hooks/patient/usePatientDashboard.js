import { useQuery } from '@tanstack/react-query';
import { getPatientDashboard } from '@/api/patientApi';

export function usePatientDashboard() {
  return useQuery({
    queryKey: ['patient', 'dashboard'],
    queryFn: getPatientDashboard,
  });
}
