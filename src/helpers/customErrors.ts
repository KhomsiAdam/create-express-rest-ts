import { Response, NextFunction } from 'express';

export const customErrors = (res: Response, next: NextFunction, message: any, code: number) => {
  const error = new Error(message);
  res.status(code);
  next(error);
};
