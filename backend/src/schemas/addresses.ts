import { z } from 'zod';

export const createAddressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  line1: z.string().min(1, 'Address line 1 is required').max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();