import type { Types } from 'mongoose';
import type { VerifyErrors, JwtPayload } from 'jsonwebtoken';

import type { Roles } from './constants';

export interface AuthInterface {
  email: string;
  role: Roles;
  refreshToken: Array<string>;
}

export interface FoundUserInterface {
  _id: Types.ObjectId;
  password: string;
  role: string;
}

export interface PayloadInterface extends JwtPayload {
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
}

export type JwtErrors = VerifyErrors | null;
export type MaybeUser = FoundUserInterface | false;
