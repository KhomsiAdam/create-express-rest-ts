import { Schema, model } from 'mongoose';
import { hash as bcryptHash, genSalt as bcryptGenSalt } from 'bcryptjs';

import { AuthModel } from '@entities/auth/model';
import type { UserEntity } from './interface';
import { SALT_ROUNDS } from './constants';

const UserSchema = new Schema<UserEntity>(
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

// Before creating a user
UserSchema.pre('save', async function save(next) {
  // Only hash password if it has been modified or new
  if (!this.isModified('password')) return next();
  // Generate salt and hash password
  const salt = await bcryptGenSalt(SALT_ROUNDS);
  this.password = await bcryptHash(this.password, salt);
  next();
});
// After creating a user
UserSchema.post('save', async (doc) => {
  // Create user in auth collection
  await AuthModel.create({ email: doc.email, role: 'User' });
});
UserSchema.post('findOneAndDelete', async (doc) => {
  // Delete user from auth collection
  await AuthModel.deleteOne({ email: doc.email });
});

export const UserModel = model<UserEntity>('User', UserSchema);
