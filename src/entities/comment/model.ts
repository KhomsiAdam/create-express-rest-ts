import { Schema, model } from 'mongoose';

import { UserModel } from '@entities/user/model';
import { IssueModel } from '@entities/issue/model';
import { CommentInterface } from './interface';

const CommentSchema = new Schema<CommentInterface>(
  {
    body: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    issue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// After creating a comment
CommentSchema.post('save', async (doc) => {
  // Add reference to comment in user
  await UserModel.updateOne({ _id: doc.user }, { $push: { comments: doc._id } });
  // Add reference to comment in issue
  await IssueModel.updateOne({ _id: doc.issue }, { $push: { comments: doc._id } });
});
// After deleting a comment
CommentSchema.post('findOneAndDelete', async (doc) => {
  // Remove comment reference from user
  await UserModel.updateOne({ comments: doc._id }, { $pull: { comments: doc._id } });
  // Remove comment reference from issue
  await IssueModel.updateOne({ comments: doc._id }, { $pull: { comments: doc._id } });
});

export const CommentModel = model<CommentInterface>('Comment', CommentSchema);
