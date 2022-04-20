import { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { UserModel } from './model';
import { userSchema } from './validation';
import { SuccessMessages, ErrorMessages } from './constants';

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, UserModel, ErrorMessages.USERS_NOT_FOUND);
});

export const getOne = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getOne(_req, res, next, UserModel, ErrorMessages.USER_NOT_FOUND);
});

export const update = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.update(req, res, next, userSchema, UserModel, SuccessMessages.USER_UPDATED, ErrorMessages.USER_NOT_FOUND);
});

export const remove = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.remove(req, res, next, UserModel, SuccessMessages.USER_DELETED, ErrorMessages.USER_NOT_FOUND);
});
