import { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { {{capitalizedName}}Model } from './model';
import { {{lowercaseName}}Schema } from './validation';
import { SuccessMessages, ErrorMessages } from './constants';

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, {{capitalizedName}}Model, ErrorMessages.{{uppercaseName}}S_NOT_FOUND);
});

export const getOne = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getOne(_req, res, next, {{capitalizedName}}Model, ErrorMessages.{{uppercaseName}}_NOT_FOUND);
});

export const update = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.update(req, res, next, {{lowercaseName}}Schema, {{capitalizedName}}Model, SuccessMessages.{{uppercaseName}}_UPDATED, ErrorMessages.{{uppercaseName}}_NOT_FOUND);
});

export const remove = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.remove(req, res, next, {{capitalizedName}}Model, SuccessMessages.{{uppercaseName}}_DELETED, ErrorMessages.{{uppercaseName}}_NOT_FOUND);
});
