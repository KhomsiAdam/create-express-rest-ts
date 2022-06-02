import { Types } from 'mongoose';

export interface {{capitalizedName}}Entity {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Types.ObjectId;
}
