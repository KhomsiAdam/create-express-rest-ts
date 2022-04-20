import { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { CommentModel } from './model';
import { createCommentSchema, updateCommentSchema } from './validation';
import { ErrorMessages, SuccessMessages } from './constants';

export const create = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.create(req, res, next, createCommentSchema, CommentModel, SuccessMessages.COMMENT_CREATED);
});

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, CommentModel, ErrorMessages.COMMENTS_NOT_FOUND);
});

export const getOne = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.getOne(req, res, next, CommentModel, ErrorMessages.COMMENT_NOT_FOUND);
});

export const update = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.update(
    req,
    res,
    next,
    updateCommentSchema,
    CommentModel,
    SuccessMessages.COMMENT_UPDATED,
    ErrorMessages.COMMENT_NOT_FOUND,
  );
});

export const remove = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.remove(req, res, next, CommentModel, SuccessMessages.COMMENT_DELETED, ErrorMessages.COMMENT_NOT_FOUND);
});
