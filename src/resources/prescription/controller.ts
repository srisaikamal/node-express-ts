import { Router, Request, Response, NextFunction } from 'express';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';

import validate from './validation';
import PrescriptionService from './service';
import storeMiddleware from '@middlewares/store';
import momentTZ from 'moment-timezone';

class PrescriptionController implements Controller {
  public path = '/prescriptions';
  public router = Router();
  public id = 'prescriptionId';
  public customerId = 'customerId';

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

    this.router.get(`${this.path}/today`, authenticationMiddleware, this.today);

    this.router.get(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      this.getById
    );

    this.router.get(
      `${this.path}/customer/:${this.customerId}`,
      authenticationMiddleware,
      this.getByCustomerId
    );

    this.router.put(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      storeMiddleware,
      this.update
    );

    this.router.delete(
      `${this.path}/:${this.id}`,
      authenticationMiddleware,
      storeMiddleware,
      this.delete
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const prescriptionService = new PrescriptionService(req.db);
      const prescription = await prescriptionService.create({
        ...req.body,
        createdBy: req.user._id,
      });
      return res.status(201).json({ result: prescription });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { date } = req.query;

    try {
      const prescriptionService = new PrescriptionService(req.db);

      const presc = await prescriptionService.list({
        ...(date && {
          createdAt: {
            $gte: momentTZ(date as string)
              .tz('Asia/Kolkata')
              .startOf('day')
              .format(),
            $lte: momentTZ(date as string)
              .tz('Asia/Kolkata')
              .endOf('day')
              .format(),
          },
        }),
      });
      return res.status(200).json({ result: presc });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private today = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const prescriptionService = new PrescriptionService(req.db);

      const presc = await prescriptionService.find({
        createdAt: {
          $gte: momentTZ().tz('Asia/Kolkata').startOf('day').format(),
          $lte: momentTZ().tz('Asia/Kolkata').endOf('day').format(),
        },
      });
      return res.status(200).json({ result: presc });
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
      const prescriptionService = new PrescriptionService(req.db);

      const prescription = await prescriptionService.getById(
        req.params[this.id]
      );
      return res.status(200).json({ result: prescription });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getByCustomerId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const prescriptionService = new PrescriptionService(req.db);

      const prescription = await prescriptionService.getByCustomerId(
        req.params[this.customerId]
      );
      return res.status(200).json({ result: prescription });
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
      const prescriptionService = new PrescriptionService(req.db);

      const prescription = await prescriptionService.updateById(
        req.params[this.id],
        req.body
      );

      if (!prescription) {
        next(new HttpException(404, 'Prescription not found'));
      }

      return res.status(200).json({ result: prescription });
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
      const prescriptionService = new PrescriptionService(req.db);

      const prescription = await prescriptionService.delete(
        req.params[this.id]
      );

      return res.status(200).json({ result: prescription });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default PrescriptionController;
