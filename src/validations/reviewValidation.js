import { z } from 'zod';

export const reviewSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment is required'),
  rating: z.coerce.number().int().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  comment: z.string().max(500, 'Comment is too long').optional(),
});