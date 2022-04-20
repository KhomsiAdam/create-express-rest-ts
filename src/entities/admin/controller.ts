import { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { AdminModel } from './model';
import { adminSchema } from './validation';
import { SuccessMessages, ErrorMessages } from './constants';

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, AdminModel, ErrorMessages.ADMINS_NOT_FOUND);
});

export const getOne = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getOne(_req, res, next, AdminModel, ErrorMessages.ADMIN_NOT_FOUND);
});

export const update = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.update(
    req,
    res,
    next,
    adminSchema,
    AdminModel,
    SuccessMessages.ADMIN_UPDATED,
    ErrorMessages.ADMIN_NOT_FOUND,
  );
});

export const remove = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.remove(req, res, next, AdminModel, SuccessMessages.ADMIN_DELETED, ErrorMessages.ADMIN_NOT_FOUND);
});
