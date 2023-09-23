import { Schema, model } from 'mongoose';
import { hash as bcryptHash, genSalt as bcryptGenSalt } from 'bcryptjs';

import { AuthModel } from '@entities/auth/model';
import type { Admin } from './schema';
import { SALT_ROUNDS } from './constants';

const AdminSchema = new Schema<Admin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    authId: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
    },
  },
  { timestamps: true },
);

// Before creating an admin
AdminSchema.pre('save', async function save(next) {
  // Only hash password if it has been modified or new
  if (!this.isModified('password')) return next();
  // Generate salt and hash password
  const salt = await bcryptGenSalt(SALT_ROUNDS);
  this.password = await bcryptHash(this.password, salt);
  next();
});
// After creating an admin
AdminSchema.post('save', async (doc) => {
  // Create admin in auth collection
  await AuthModel.create({ email: doc.email, role: 'Admin' });
});
AdminSchema.post('findOneAndDelete', async (doc) => {
  // Delete admin from auth collection
  await AuthModel.deleteOne({ email: doc.email });
});

export const AdminModel = model<Admin>('Admin', AdminSchema);
