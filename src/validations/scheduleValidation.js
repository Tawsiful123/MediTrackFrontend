import { z } from 'zod';
import { WEEKDAYS } from '@/utils/constants';

export const scheduleSchema = z.object({
  weekday: z.enum(WEEKDAYS, { message: 'Select a valid day' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  slotDurationMinutes: z.coerce.number().int().min(5, 'Minimum 5 minutes').max(120, 'Maximum 120 minutes'),
  isAvailable: z.boolean().default(true),
}).refine((data) => data.startTime < data.endTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});