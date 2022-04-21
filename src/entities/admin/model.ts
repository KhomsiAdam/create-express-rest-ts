import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { AuthModel } from '@entities/auth/model';
import { AdminInterface } from './interface';
import { SALT_ROUNDS } from './constants';

const AdminSchema = new Schema<AdminInterface>(
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
    role: {
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
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
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

export const AdminModel = model<AdminInterface>('Admin', AdminSchema);
