import { Request, Response, NextFunction } from 'express';
import { customErrors } from '@helpers/customErrors';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  customErrors(res, next, `Not Found - ${req.originalUrl}`, 404);
};
