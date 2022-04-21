import { Types } from 'mongoose';

export interface AdminInterface {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Types.ObjectId;
}
