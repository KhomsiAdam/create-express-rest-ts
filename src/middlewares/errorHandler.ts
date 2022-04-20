import { NextFunction, Request, Response } from 'express';
import { log } from '@services/logger.service';

export interface ErrorHandler {
  message: string;
  stack: string;
}

export const errorHandler = (err: ErrorHandler, _req: Request, res: Response, next: NextFunction) => {
  res.status(res.statusCode || 500);
  if (process.env.NODE_ENV !== 'production') {
    res.json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.json({
      message: err.message,
    });
  }
  log.error(err.message);
  next();
};
