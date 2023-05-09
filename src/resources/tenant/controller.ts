import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import TenantService from './service';

class TenantController implements Controller {
  public path = '/tenants';
  public router = Router();
  public id = 'tenantId';

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
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/:${this.id}`, this.get);
    this.router.patch(`${this.path}/:${this.id}`, this.patch);
    this.router.delete(`${this.path}/:${this.id}`, this.delete);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const tenantService = new TenantService(req.db);
      const tenant = await tenantService.create(req.body);
      return res.status(201).json({ result: tenant });
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
      const tenantService = new TenantService(req.db);
      const tenants = await tenantService.list();
      return res.status(200).json({ result: tenants });
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
      const tenantService = new TenantService(req.db);
      const tenant = await tenantService.findOne(req.params[this.id]);
      if (!tenant) {
        return next(new HttpException(404, 'Tenant Not Found'));
      }
      return res.status(200).json({ result: tenant });
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
      const tenantService = new TenantService(req.db);
      await tenantService.patch(req.params[this.id], req.body);
      return res.status(200).json({ message: 'Tenant Updated Successfully' });
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
      const tenantService = new TenantService(req.db);
      await tenantService.delete(req.params[this.id]);
      return res.status(200).json({ message: 'Tenant Deleted Successfully' });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default TenantController;
