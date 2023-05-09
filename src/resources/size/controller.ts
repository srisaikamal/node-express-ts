import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import SizeService from './service';

class SizeController implements Controller {
  public path = '/sizes';
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
      const sizeService = new SizeService(req.db);
      const size = await sizeService.create(name, description);
      return res.status(201).json({ result: size });
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
      const sizeService = new SizeService(req.db);
      const sizes = await sizeService.list();
      return res.status(200).json({ result: sizes });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default SizeController;
