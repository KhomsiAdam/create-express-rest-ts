import { NextFunction, Request, Response } from 'express';
import { verifyAuth } from '@services/auth.service';

export const is = {
  Auth: async (req: Request, res: Response, next: NextFunction) => {
    verifyAuth(req, res, next);
  },
  User: async (req: Request, res: Response, next: NextFunction) => {
    verifyAuth(req, res, next, 'User');
  },
  Admin: async (req: Request, res: Response, next: NextFunction) => {
    verifyAuth(req, res, next, 'Admin');
  },
};
