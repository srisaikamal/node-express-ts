import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';
import validationMiddleware from '@middlewares/validation';
import validate from './validation';
import StoreService from './service';
import authenticationMiddleware from '@middlewares/authentication';

class StoreController implements Controller {
  public path = '/stores';
  public id = 'storeId';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.create),
      authenticationMiddleware,
      this.create
    );

    this.router.get(`${this.path}`, authenticationMiddleware, this.list);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description } = req.body;

      const storeService = new StoreService(req.db);
      const store = await storeService.create(name, description);
      return res.status(201).json({ result: store });
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
      const storeService = new StoreService(req.db);
      const stores = await storeService.list();
      return res.status(200).json({ result: stores });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default StoreController;
