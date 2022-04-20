import { Schema, model } from 'mongoose';

import { IssueModel } from '@entities/issue/model';
import { ProjectInterface } from './interface';

const ProjectSchema = new Schema<ProjectInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Issue',
      },
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

// After deleting a project
ProjectSchema.post('findOneAndDelete', async (doc) => {
  // Delete all issues of the project
  await IssueModel.deleteMany({ _id: doc.issues });
});

export const ProjectModel = model<ProjectInterface>('Project', ProjectSchema);
