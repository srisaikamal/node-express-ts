import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import ReceiptService from './service';

class ReceiptController implements Controller {
  public path = '/receipts';
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
    this.router.get(`${this.path}/stats`, authenticationMiddleware, this.stats);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const receiptService = new ReceiptService(req.db);
      const receipt = await receiptService.create(
        {
          ...req.body,
          createdBy: req.user._id,
        },
        req.store
      );
      return res.status(201).json({ result: receipt });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private stats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const receiptService = new ReceiptService(req.db);
      const stats = await receiptService.stats();
      return res.status(200).json({ result: stats });
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
      const { startDate, endDate, orderBy, order, page, rowsPerPage } =
        req.query;
      const receiptService = new ReceiptService(req.db);
      const { receipts, count } = await receiptService.list(
        {
          ...(startDate &&
            endDate && {
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            }),
        },
        { [orderBy as string]: order === 'desc' ? -1 : 1 },
        Number(page) * Number(rowsPerPage),
        Number(rowsPerPage)
      );
      return res.status(200).json({ result: receipts, count });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default ReceiptController;
