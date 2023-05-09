import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import RoleService from './service';

class RoleController implements Controller {
  public path = '/roles';
  public router = Router();
  public id = 'roleId';

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
      this.delete
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description, permissions } = req.body;
      const roleService = new RoleService(req.db);
      const role = await roleService.create(name, permissions, description);
      return res.status(201).json({ result: role });
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
      const roleService = new RoleService(req.db);
      const roles = await roleService.list();
      return res.status(200).json({ result: roles });
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
      const roleService = new RoleService(req.db);
      await roleService.delete(req.params[this.id]);
      return res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default RoleController;
