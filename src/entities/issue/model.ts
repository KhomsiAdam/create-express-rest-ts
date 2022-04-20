import { Schema, model } from 'mongoose';

import { CommentModel } from '@entities/comment/model';
import { ProjectModel } from '@entities/project/model';
import { IssueInterface } from './interface';

const IssueSchema = new Schema<IssueInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    estimate: {
      type: Number,
    },
    timeSpent: {
      type: Number,
    },
    timeRemaining: {
      type: Number,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
      },
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  { timestamps: true },
);

// After creating an issue
IssueSchema.post('save', async (doc) => {
  // Add reference to issue in selected project
  await ProjectModel.updateOne({ _id: doc.project }, { $push: { issues: doc._id } });
});
// After deleting an issue
IssueSchema.post('findOneAndDelete', async (doc) => {
  // Delete all comments of the issue
  await CommentModel.deleteMany({ issue: doc._id });
  // Remove all issues references from the project
  await ProjectModel.updateMany({ issues: doc._id }, { $pull: { issues: doc._id } });
});

export const IssueModel = model<IssueInterface>('Issue', IssueSchema);
