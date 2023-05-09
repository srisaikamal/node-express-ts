import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import ProductPriceService from './service';

class ProductPriceController implements Controller {
  public path = '/product-prices';
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
    this.router.patch(
      `${this.path}/bulk`,
      authenticationMiddleware,
      validationMiddleware(validate.bulkPatch),
      this.patchBulk
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { product, size, price } = req.body;
      const productPriceService = new ProductPriceService(req.db);
      const productPriceDoc = await productPriceService.create(
        product,
        size,
        price
      );
      return res.status(201).json({ result: productPriceDoc });
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
      const product = (req.query.product || '').toString();
      const size = (req.query.size || '').toString();
      const productPriceService = new ProductPriceService(req.db);
      const productPrices = await productPriceService.list(product, size);
      return res.status(200).json({ result: productPrices });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private patchBulk = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { prices } = req.body;
      const productPriceService = new ProductPriceService(req.db);
      const productPriceDocs = await productPriceService.patchBulk(prices);
      return res.status(200).json({ result: productPriceDocs });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default ProductPriceController;
