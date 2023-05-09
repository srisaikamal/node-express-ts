import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller';
import HttpException from '@utils/exceptions/http';
import authenticationMiddleware from '@middlewares/authentication';
import storeMiddleware from '@middlewares/store';
import DilutionService from './service';

class ProductController implements Controller {
  public id = 'dilutionId';
  public path = '/dilutions';
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
      `${this.path}/list`,
      authenticationMiddleware,
      storeMiddleware,
      this.listAll
    );

    // this.router.get(`${this.path}/add`, this.addAllDilutions);
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
      const dilutionService = new DilutionService(req.db);
      const dilutions = await dilutionService.list(
        search,
        offset,
        limit,
        req.store
      );
      return res.status(200).json({
        result: dilutions,
        message: 'dilutions retrieved successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private listAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const offset = parseInt((req.query.offset || 0).toString());
      const limit = parseInt((req.query.limit || 0).toString()) || 0;
      const search = (req.query.search || '')?.toString();
      const dilutionService = new DilutionService(req.db);
      const { dilutions, count } = await dilutionService.listAll(
        limit,
        offset,
        search
      );
      return res.status(200).json({
        result: dilutions,
        count,
        message: 'dilutions retrieved successfully!',
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  // private addAllDilutions = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     var wb = XLSX.readFile(
  //       path.resolve(__dirname, '../../../dilutions.xlsx')
  //     );
  //     let data = XLSX.utils
  //       .sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
  //         header: 1,
  //       })
  //       .slice(1) as string[][];

  //     const dilutions = await this.DilutionService.addAllDilutions(data);

  //     return res.status(200).json({
  //       result: data,
  //       message: 'dilutions retrieved successfully!',
  //     });
  //   } catch (error: any) {
  //     next(new HttpException(400, error.message));
  //   }
  // };
}

export default ProductController;
