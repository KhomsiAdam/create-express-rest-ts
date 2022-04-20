import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { AuthModel } from '@entities/auth/model';
import { SALT_ROUNDS } from './constants';
import { {{capitalizedName}}Interface } from './interface';

const {{capitalizedName}}Schema = new Schema<{{capitalizedName}}Interface>(
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
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
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

export const {{capitalizedName}}Model = model<{{capitalizedName}}Interface>('{{capitalizedName}}', {{capitalizedName}}Schema);
