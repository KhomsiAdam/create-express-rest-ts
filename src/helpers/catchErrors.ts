import { Request, Response, NextFunction, RequestHandler } from 'express';

export const catchErrors =
  (requestHandler: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
