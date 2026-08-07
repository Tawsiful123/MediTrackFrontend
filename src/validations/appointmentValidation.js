import { z } from 'zod';

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  date: z.string().min(1, 'Pick a date'),
  timeSlot: z.string().min(1, 'Pick a time slot'),
  reason: z.string().max(500, 'Reason is too long').optional(),
  notes: z.string().max(500, 'Notes are too long').optional(),
});

export const rescheduleSchema = z.object({
  date: z.string().min(1, 'Pick a date'),
  timeSlot: z.string().min(1, 'Pick a time slot'),
});

export const updateStatusSchema = z.object({
  status: z.string().min(1, 'Select a status'),
});