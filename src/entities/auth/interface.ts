import { Types, Document } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthInterface {
  email: string;
  role: string;
  refreshToken: Array<string>;
}

export interface FetchedUserInterface extends AuthInterface {
  _id: Types.ObjectId;
  password: string;
  save: Document['save'];
}

export interface PayloadInterface extends JwtPayload {
  user: Types.ObjectId;
  role: Types.ObjectId;
}
