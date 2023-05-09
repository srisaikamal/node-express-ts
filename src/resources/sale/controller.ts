import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';
import validationMiddleware from '@middlewares/validation';
import validate from './validation';
import SaleService from './service';
import authenticationMiddleware from '@middlewares/authentication';
import storeMiddleware from '@middlewares/store';

class SaleController implements Controller {
  public path = '/sales';
  public router = Router();
  private id = 'saleId';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.path,
      authenticationMiddleware,
      validationMiddleware(validate.create),
      storeMiddleware,
      this.create
    );

    this.router.get(this.path, authenticationMiddleware, this.list);

    this.router.delete(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      storeMiddleware,
      this.deleteById
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const saleService = new SaleService(req.db);
      const result = await saleService.create({
        ...req.body,
        store: req.store,
      });
      return res.status(201).json({ result });
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
      const saleService = new SaleService(req.db);
      const result = await saleService.list();
      return res.status(200).json({ result });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const saleService = new SaleService(req.db);
      const result = await saleService.deleteById(req.params[this.id]);
      return res.status(200).json({ result });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default SaleController;
