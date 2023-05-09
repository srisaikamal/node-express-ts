import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import TabletService from './service';

class TabletController implements Controller {
  public path = '/tablets';
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
      const { name, description } = req.body;
      const tabletService = new TabletService(req.db);
      const tablet = await tabletService.create(name, description);
      return res.status(201).json({ result: tablet });
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
      const tabletService = new TabletService(req.db);
      const tablets = await tabletService.list();
      return res.status(200).json({ result: tablets });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default TabletController;
