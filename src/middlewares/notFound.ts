import { Request, Response, NextFunction } from 'express';
import { customError } from '@helpers/customError';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  customError(res, next, `Not Found - ${req.originalUrl}`, 404);
};
