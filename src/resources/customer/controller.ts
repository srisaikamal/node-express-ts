import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import CustomerService from './service';

class CustomerController implements Controller {
  public path = '/customers';
  public router = Router();
  public id = 'customerId';

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

    this.router.get(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      this.getById
    );

    this.router.get(
      `${this.path}/:${this.id}/family/`,
      authenticationMiddleware,
      this.getFamily
    );

    this.router.patch(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      this.patch
    );

    this.router.delete(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      this.delete
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, phone, age, gender } = req.body;
      const numAge = Number(age);
      const customerService = new CustomerService(req.db);
      const customer = await customerService.create(
        name,
        phone,
        numAge,
        gender
      );
      return res.status(201).json({ result: customer });
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
      const customerService = new CustomerService(req.db);
      const customers = await customerService.list();
      return res.status(200).json({ result: customers });
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
      const customerService = new CustomerService(req.db);
      const customer = await customerService.getById(req.params[this.id]);
      if (customer === null) {
        next(new HttpException(404, 'Customer not found'));
      }
      return res.status(200).json({ result: customer });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getFamily = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const customerService = new CustomerService(req.db);
      const family = await customerService.getFamily(req.params[this.id]);
      return res.status(200).json({ result: family });
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
      const customerService = new CustomerService(req.db);
      const customer = await customerService.patchCustomer(
        req.body,
        req.params[this.id]
      );
      if (customer === null) {
        next(new HttpException(404, 'Customer not found'));
      }
      return res.status(200).json({ result: customer });
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
      const customerService = new CustomerService(req.db);
      const customer = await customerService.deleteCustomer(
        req.params[this.id]
      );
      return res.status(200).json({ result: customer });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default CustomerController;
