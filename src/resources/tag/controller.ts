import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';
import validationMiddleware from '@middlewares/validation';
import validate from './validation';
import TagService from './service';
import authenticationMiddleware from '@middlewares/authentication';

class TagController implements Controller {
  public path = '/tags';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      authenticationMiddleware,
      validationMiddleware(validate.create),
      this.create
    );

    this.router.get(`${this.path}`, authenticationMiddleware, this.list);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description } = req.body;
      const tagService = new TagService(req.db);
      const tag = await tagService.create(name, description);
      return res.status(201).json({ result: tag });
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
      const tagService = new TagService(req.db);
      const tags = await tagService.list();
      return res.status(200).json({ result: tags });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default TagController;
