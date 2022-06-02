import { Schema, model } from 'mongoose';
import { hash as bcryptHash, genSalt as bcryptGenSalt } from 'bcryptjs';

import { AuthModel } from '@entities/auth/model';
import type { {{capitalizedName}}Entity } from './interface';
import { SALT_ROUNDS } from './constants';

const {{capitalizedName}}Schema = new Schema<{{capitalizedName}}Entity>(
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

// Before creating a {{lowercaseName}}
{{capitalizedName}}Schema.pre('save', async function save(next) {
  // Only hash password if it has been modified or new
  if (!this.isModified('password')) return next();
  // Generate salt and hash password
  const salt = await bcryptGenSalt(SALT_ROUNDS);
  this.password = await bcryptHash(this.password, salt);
  next();
});
// After creating a {{lowercaseName}}
{{capitalizedName}}Schema.post('save', async (doc) => {
  // Create {{lowercaseName}} in auth collection
  await AuthModel.create({ email: doc.email, role: '{{capitalizedName}}' });
});
{{capitalizedName}}Schema.post('findOneAndDelete', async (doc) => {
  // Delete {{lowercaseName}} from auth collection
  await AuthModel.deleteOne({ email: doc.email });
});

export const {{capitalizedName}}Model = model<{{capitalizedName}}Entity>('{{capitalizedName}}', {{capitalizedName}}Schema);
