import { Types } from 'mongoose';
import { z } from 'zod';

export const AdminSchema = z.object({
  email: z.string().trim(),
  password: z.string().trim(),
  firstname: z.string().trim(),
  lastname: z.string().trim(),
  authId: z.instanceof(Types.ObjectId),
});

export type Admin = z.infer<typeof AdminSchema>;
