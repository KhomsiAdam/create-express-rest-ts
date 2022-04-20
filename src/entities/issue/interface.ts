import { Types } from 'mongoose';

export interface IssueInterface {
  title: string;
  type: string;
  status: string;
  priority: number;
  reporter: Types.ObjectId;
  project: Types.ObjectId;
  estimate?: number;
  timeSpent?: number;
  timeRemaining?: number;
  comments?: Array<Types.ObjectId>;
  users?: Array<Types.ObjectId>;
}
