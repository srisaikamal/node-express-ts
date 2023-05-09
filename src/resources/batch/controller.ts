import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import BatchService from './service';
import storeMiddleware from '@middlewares/store';

class BatchController implements Controller {
  public path = '/batches';
  public id = 'batchId';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.path,
      authenticationMiddleware,
      storeMiddleware,
      validationMiddleware(validate.create),
      this.create
    );

    this.router.put(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      storeMiddleware,
      validationMiddleware(validate.put),
      this.put
    );

    this.router.get(
      this.path,
      authenticationMiddleware,
      storeMiddleware,
      this.list
    );

    this.router.get(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      storeMiddleware,
      this.getById
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const batchService = new BatchService(req.db);
      const batch = await batchService.create({
        ...req.body,
        store: req.store,
      });
      return res.status(201).json({ result: batch });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private put = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const batchService = new BatchService(req.db);
      await batchService.put(req.body, req.params[this.id]);
      return res.status(201).json({ message: 'Batch updated successfully' });
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
      const query = {
        ...(req.query.productId && { product: req.query.productId }),
      };
      const batchService = new BatchService(req.db);
      const batches = await batchService.list(query);
      return res.status(200).json({ result: batches });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const batchService = new BatchService(req.db);
      const batch = await batchService.getById(req.params[this.id]);
      return res.status(200).json({ result: batch });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default BatchController;
