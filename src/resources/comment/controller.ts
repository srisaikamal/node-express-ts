import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import CommentService from './service';

class CommentController implements Controller {
  public path = '/comments';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.path,
      authenticationMiddleware,
      validationMiddleware(validate.create),
      this.create
    );

    this.router.get(this.path, authenticationMiddleware, this.list);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const commentService = new CommentService(req.db);
      const comment = await commentService.create({
        ...req.body,
        createdBy: req.user._id,
      });
      return res.status(201).json({ result: comment });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const commentService = new CommentService(req.db);
      const comments = await commentService.list();
      return res.status(200).json({ result: comments });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default CommentController;
