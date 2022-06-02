import { Types } from 'mongoose';

export interface AdminEntity {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Types.ObjectId;
}
