import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import PillService from './service';

class PillController implements Controller {
  public path = '/pills';
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
      const pillService = new PillService(req.db);
      const pill = await pillService.create(name, description);
      return res.status(201).json({ result: pill });
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
      const pillService = new PillService(req.db);
      const pills = await pillService.list();
      return res.status(200).json({ result: pills });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default PillController;
