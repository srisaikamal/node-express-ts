import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';
import validationMiddleware from '@middlewares/validation';
import validate from './validation';
import BrandService from './service';
import authenticationMiddleware from '@middlewares/authentication';

class BrandController implements Controller {
  public path = '/brands';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.path,
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
      const brandService = new BrandService(req.db);
      const { name, description } = req.body;
      const brand = await brandService.create(name, description);
      return res.status(201).json({ brand });
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
      const brandService = new BrandService(req.db);
      const brands = await brandService.list();
      return res.status(201).json({ result: brands });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default BrandController;
