import { Schema, model } from 'mongoose';

import { AdminModel } from '@entities/admin/model';
import { UserModel } from '@entities/user/model';
import { AuthInterface } from './interface';

const AuthSchema = new Schema<AuthInterface>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    refreshToken: [
      {
        type: String,
        default: [],
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

export const AuthModel = model<AuthInterface>('Auth', AuthSchema);
