import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { AuthModel } from '@entities/auth/model';
import { CommentModel } from '@entities/comment/model';
import { IssueModel } from '@entities/issue/model';
import { ProjectModel } from '@entities/project/model';
import { SALT_ROUNDS } from './constants';
import { UserInterface } from './interface';

const UserSchema = new Schema<UserInterface>(
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
      },
    ],
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Issue',
        default: [],
      },
    ],
  },
  { timestamps: true },
);

// Before creating a user
UserSchema.pre('save', async function save(next) {
  // Only hash password if it has been modified or new
  if (!this.isModified('password')) return next();
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
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
  // Delete all comments of user
  await CommentModel.deleteMany({ user: doc._id });
  // Remove user reference from assigned issues
  await IssueModel.updateMany({ users: doc._id }, { $pull: { users: doc._id } });
  // Remove user reference from projects
  await ProjectModel.updateMany({ users: doc._id }, { $pull: { users: doc._id } });
});

export const UserModel = model<UserInterface>('User', UserSchema);
