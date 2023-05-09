import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';
import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';
import * as validate from './validation';
import UserService from './service';
import storeMiddleware from '@middlewares/store';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  public id = 'userId';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );

    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );

    this.router.get(`${this.path}/me`, authenticationMiddleware, this.getUser);
    this.router.get(this.path, authenticationMiddleware, this.list);

    this.router.get(
      `${this.path}/doctors`,
      authenticationMiddleware,
      storeMiddleware,
      this.getDoctors
    );

    this.router.delete(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      this.delete
    );
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userService = new UserService(req.db);
      const newUser = await userService.register(req.body);
      return res
        .status(201)
        .json({ result: newUser, message: 'User registered successfully!' });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, password, isRememberEnabled } = req.body;
      const userService = new UserService(req.db);
      const result = await userService.login(
        username,
        password,
        req.headers['tenant'] as string,
        isRememberEnabled
      );
      return res.status(200).json({
        result,
        message: 'User Loggedin successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      await (await req.user.populate('stores')).populate('role');
      const { role, stores, firstName, lastName, username } = req.user;
      return res.status(200).json({
        result: {
          role,
          stores,
          firstName,
          lastName,
          username,
          tenant: req.headers['tenant'],
        },
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getDoctors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { store } = req;
      const userService = new UserService(req.db);
      const result = await userService.getDoctors(store);
      return res.status(200).json({
        result,
        message: 'Doctors retrieved successfully!',
      });
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
      const userService = new UserService(req.db);
      const result = await userService.list();
      return res.status(200).json({
        result,
        message: 'Users list retrieved successfully!',
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
      const userService = new UserService(req.db);
      const result = await userService.delete(req.params[this.id]);
      return res.status(200).json({
        result,
        message: 'User deleted successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default UserController;
