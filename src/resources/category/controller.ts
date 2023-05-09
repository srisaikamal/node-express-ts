import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import CategoryService from './service';

class CategoryController implements Controller {
  public path = '/categories';
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
      const categoryService = new CategoryService(req.db);
      const category = await categoryService.create(name, description);
      return res.status(201).json({ result: category });
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
      const categoryService = new CategoryService(req.db);
      const categories = await categoryService.list();
      return res.status(200).json({ result: categories });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default CategoryController;
