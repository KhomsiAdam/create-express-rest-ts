import { Types } from 'mongoose';

export interface CommentInterface {
  body: string;
  date: Date;
  issue?: Types.ObjectId;
  user?: Types.ObjectId;
}
