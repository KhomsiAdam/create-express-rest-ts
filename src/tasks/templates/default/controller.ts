import { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { {{capitalizedName}}Model } from './model';
import { create{{capitalizedName}}Schema, update{{capitalizedName}}Schema } from './validation';
import { ErrorMessages, SuccessMessages } from './constants';

export const create = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.create(req, res, next, create{{capitalizedName}}Schema, {{capitalizedName}}Model, SuccessMessages.{{uppercaseName}}_CREATED);
});

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, {{capitalizedName}}Model, ErrorMessages.{{uppercaseName}}S_NOT_FOUND, false);
});

export const getOne = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.getOne(req, res, next, {{capitalizedName}}Model, ErrorMessages.{{uppercaseName}}_NOT_FOUND, false);
});

export const update = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.update(
    req,
    res,
    next,
    update{{capitalizedName}}Schema,
    {{capitalizedName}}Model,
    SuccessMessages.{{uppercaseName}}_UPDATED,
    ErrorMessages.{{uppercaseName}}_NOT_FOUND,
  );
});

export const remove = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.remove(req, res, next, {{capitalizedName}}Model, SuccessMessages.{{uppercaseName}}_DELETED, ErrorMessages.{{uppercaseName}}_NOT_FOUND);
});
