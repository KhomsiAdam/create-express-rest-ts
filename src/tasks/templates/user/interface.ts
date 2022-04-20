import { Types } from 'mongoose';

export interface {{capitalizedName}}Interface {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Types.ObjectId;
}
