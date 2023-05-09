import { Router, Request, Response, NextFunction } from 'express';
import momentTZ from 'moment-timezone';

import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';

import validationMiddleware from '@middlewares/validation';
import authenticationMiddleware from '@middlewares/authentication';
import storeMiddleware from '@middlewares/store';

import validate from './validation';
import AppointmentService from './service';

class AppointmentController implements Controller {
  public path = '/appointments';
  public router = Router();

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
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { doctor, customer, date } = req.body;
      const { _id: userId } = req.user;
      const appointmentService = new AppointmentService(req.db);
      const appointment = await appointmentService.create(
        doctor,
        customer,
        date,
        userId
      );
      return res.status(201).json({ result: appointment });
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
      const { date, doctor } = req.query;
      const appointmentService = new AppointmentService(req.db);
      const appointment = await appointmentService.find({
        ...(date && {
          date: {
            $gte: momentTZ(date as string)
              .tz('Asia/Kolkata')
              .startOf('day'),
            $lte: momentTZ(date as string)
              .tz('Asia/Kolkata')
              .endOf('day'),
          },
        }),
        ...(doctor && { doctor }),
      });
      return res.status(200).json({ result: appointment });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default AppointmentController;
