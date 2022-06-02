import { Types } from 'mongoose';

export interface UserEntity {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Types.ObjectId;
}
