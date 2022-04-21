import { Types } from 'mongoose';

export interface UserInterface {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Types.ObjectId;
}
