import type { NextFunction, Request, Response } from 'express';
import { verifyAuth } from '@services/auth.service';
import { Roles, Permissions } from '@entities/auth/constants';

export const is = {
  Auth: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next);
  },
  Self: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, undefined, Permissions.SELF);
  },
  Own: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, undefined, Permissions.OWN);
  },
  Admin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, Roles.ADMIN);
  },
  User: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, Roles.USER);
  },
};
