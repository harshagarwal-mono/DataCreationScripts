import { z } from 'zod';

export const fontDetailsSchema = z.object({
  font_style_id: z.string().trim().min(1, 'Font style ID cannot be empty'),
  family_id: z.string().trim().min(1, 'Family ID cannot be empty'),
  font_name: z.string().trim().min(1, 'Font name cannot be empty')
}).strict();
