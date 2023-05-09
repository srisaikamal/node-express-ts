import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';
import validationMiddleware from '@middlewares/validation';
import validate from './validation';
import ProductService from './service';
import authenticationMiddleware from '@middlewares/authentication';
import storeMiddleware from '@middlewares/store';
import { Potencies } from '@utils/constants';
import { validateSingleFileUploadMiddleware } from '@middlewares/file';
import BatchService from '@resources/batch/service';

class ProductController implements Controller {
  public id = 'productId';
  public path = '/products';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      authenticationMiddleware,
      storeMiddleware,
      this.list
    );

    this.router.get(
      `${this.path}/search`,
      authenticationMiddleware,
      storeMiddleware,
      this.search
    );

    this.router.get(
      `${this.path}/potencies`,
      authenticationMiddleware,
      this.getPotencies
    );

    this.router.get(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      storeMiddleware,
      this.get
    );

    this.router.post(
      this.path,
      validationMiddleware(validate.createAndUpdate),
      authenticationMiddleware,
      storeMiddleware,
      this.create
    );

    this.router.post(
      `${this.path}/bulk`,
      authenticationMiddleware,
      storeMiddleware,
      validateSingleFileUploadMiddleware('file', ['.xlsx', '.xls']),
      this.bulkCreate
    );

    this.router.put(
      `${this.path}/:${this.id}`,
      validationMiddleware(validate.createAndUpdate),
      authenticationMiddleware,
      storeMiddleware,
      this.update
    );

    this.router.patch(
      `${this.path}/:${this.id}`,
      validationMiddleware(validate.patch),
      authenticationMiddleware,
      storeMiddleware,
      this.patch
    );

    this.router.patch(
      `${this.path}/:${this.id}/image`,
      validationMiddleware(validate.patchImage),
      authenticationMiddleware,
      storeMiddleware,
      this.patchImage
    );

    this.router.delete(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      this.delete
    );

    this.router.delete(
      `${this.path}/:${this.id}/image/:imageIndex`,
      authenticationMiddleware,
      this.deleteImage
    );
  }

  private list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const limit = parseInt((req.query.limit || 20).toString());
      const offset = parseInt((req.query.offset || 0).toString());
      const search = (req.query.search || '').toString();
      const type = (req.query.type || '').toString();
      const productService = new ProductService(req.db);
      const products = await productService.list(
        search,
        offset,
        limit,
        type,
        req.store
      );
      return res.status(200).json({
        result: products,
        message: 'Products retrieved successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private search = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const limit = parseInt((req.query.limit || 20).toString());
      const offset = parseInt((req.query.offset || 0).toString());
      const search = (req.query.search || '').toString();
      const type = (req.query.type || '').toString();
      const productService = new ProductService(req.db);
      const products = await productService.search(search, offset, limit, type);
      return res.status(200).json({
        result: products,
        message: 'Products retrieved successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      const id = req.params[this.id];
      const product = await productService.getOne(id);
      if (product === null) {
        return next(new HttpException(404, 'Product not found'));
      }
      return res.status(200).json({
        result: product,
        message: 'Product retrieved successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getPotencies = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    try {
      return res.status(200).json({
        result: Object.keys(Potencies),
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      req.body = { ...req.body, createdBy: req.user._id };
      const product = await productService.create(req.body);
      if (
        req.body.batch &&
        !Array.isArray(product) &&
        !(product instanceof Error)
      ) {
        const batchService = new BatchService(req.db);
        await batchService.create({
          ...req.body.batch,
          ...(req?.body?.batch?.location && {
            location: [req?.body?.batch?.location],
          }),
          product: product._id,
        });
      }

      return res.status(201).json({
        result: product,
        message: 'Product created successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private bulkCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      const uploadedProducts = await productService.bulkUpload(
        req.filePath,
        req.user?._id,
        req.store
      );
      return res.status(201).json({
        result: uploadedProducts,
        message: 'Products created successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      const id = req.params[this.id];
      const product = await productService.update(req.body, id);
      if (product === null) {
        return next(new HttpException(404, 'Product not found'));
      }
      return res.status(204).json({
        message: 'Product updated successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private patch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      const id = req.params[this.id];
      const product = await productService.patch(req.body, id);
      if (product === null) {
        return next(new HttpException(404, 'Product not found'));
      }
      return res.status(204).json({
        message: 'Product updated successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private patchImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      const id = req.params[this.id];
      const product = await productService.patchImage(req.body, id);
      if (product === null) {
        return next(new HttpException(404, 'Product not found'));
      }
      return res.status(204).json({
        message: 'Product updated successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      const id = req.params[this.id];
      const product = await productService.deleteById(id);
      if (product === null) {
        return next(new HttpException(404, 'Product not found'));
      }
      return res.status(204).json({
        message: 'Product deleted successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private deleteImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const productService = new ProductService(req.db);
      const id = req.params[this.id];
      const index = parseInt(req.params.imageIndex);
      const product = await productService.deleteImage(id, index);
      if (product === null) {
        return next(new HttpException(404, 'Product not found'));
      }
      if (product instanceof Error) {
        return next(new HttpException(400, product.message));
      }
      return res.status(204).json({
        message: 'Product Image deleted successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default ProductController;
