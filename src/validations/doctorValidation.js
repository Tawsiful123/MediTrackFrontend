import { z } from 'zod';

export const doctorProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  specializationId: z.string().min(1, 'Select a specialization'),
  hospitalName: z.string().optional(),
  clinicAddress: z.string().optional(),
  consultationFee: z.coerce.number().positive('Fee must be greater than 0'),
  experienceYears: z.coerce.number().min(0).optional(),
  bio: z.string().max(1000).optional(),
});

export const clinicLocationSchema = z.object({
  clinicAddress: z.string().min(3, 'Clinic address is required'),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});