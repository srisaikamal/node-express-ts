import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';
import storeMiddleware from '@middlewares/store';

import validate from './validation';
import SettingsService from './service';

class SettingsController implements Controller {
  public path = '/settings';
  public router = Router();
  private name = 'name';

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

    this.router.get(
      this.path,
      authenticationMiddleware,
      storeMiddleware,
      this.list
    );

    this.router.get(
      `${this.path}/:${this.name}`,
      authenticationMiddleware,
      storeMiddleware,
      this.getByName
    );

    this.router.patch(
      `${this.path}/:${this.name}`,
      authenticationMiddleware,
      storeMiddleware,
      this.patch
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description, value } = req.body;
      const { store } = req;
      const settingsService = new SettingsService(req.db);
      const settings = await settingsService.create(
        name,
        value,
        store,
        description
      );
      return res.status(201).json({ result: settings });
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
      const settingsService = new SettingsService(req.db);
      const settings = await settingsService.list();
      return res.status(200).json({ result: settings });
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
      const name = req.params[this.name];
      const { value } = req.body;
      const { store } = req;
      const settingsService = new SettingsService(req.db);
      const settings = await settingsService.patch(name, value, store);
      return res.status(200).json({ result: settings });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const name = req.params[this.name];
      const { store } = req;
      const settingsService = new SettingsService(req.db);
      const settings = await settingsService.getByName(name, store);
      return res.status(200).json({ result: settings });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default SettingsController;
