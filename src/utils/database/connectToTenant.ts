import HttpException from '@utils/exceptions/http';
import { RequestHandler } from 'express';
import switchToDatabase from './switch';

const connectToTenant: RequestHandler = async (req, res, next) => {
  const tenant = req.headers.tenant;
  if (tenant && !Array.isArray(tenant)) {
    const db = switchToDatabase(tenant);
    req.db = db;
    next();
  } else {
    next(new HttpException(403, 'No tenant provided'));
  }
};

export default connectToTenant;
