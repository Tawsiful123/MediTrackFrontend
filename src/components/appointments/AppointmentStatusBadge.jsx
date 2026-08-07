import Badge from '@/components/common/Badge';
import { getStatusColor } from '@/utils/constants';

export default function AppointmentStatusBadge({ status = '' }) {
  return (
    <Badge status={getStatusColor(status)}>{status || '—'}</Badge>
  );
}