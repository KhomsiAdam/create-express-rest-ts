import { Schema, model } from 'mongoose';

import { AdminModel } from '@entities/admin/model';
import { UserModel } from '@entities/user/model';
import { Roles } from './constants';
import type { AuthData } from './interface';

const AuthSchema = new Schema<AuthData>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      required: true,
    },
    refreshToken: [
      {
        type: String,
        default: [],
        select: false,
      },
    ],
  },
  { timestamps: true },
);

// After creating a user
AuthSchema.post('save', async (doc) => {
  // Add reference to role in user by email
  if (doc.role === 'Admin') {
    await AdminModel.updateOne({ email: doc.email }, { role: doc._id });
  } else {
    await UserModel.updateOne({ email: doc.email }, { role: doc._id });
  }
});

export const AuthModel = model<AuthData>('Auth', AuthSchema);
