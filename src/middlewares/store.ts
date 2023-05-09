import { Request, Response, NextFunction } from 'express';
import HttpException from '@utils/exceptions/http';
import { isValidObjectId } from 'mongoose';

async function storeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const store = req.headers.store;

  if (!store || !isValidObjectId(store)) {
    return next(new HttpException(401, 'Please select a valid store'));
  }

  try {
    if (typeof store === 'string') {
      if (req.user.stores.includes(store)) {
        req.store = store;
        return next();
      } else {
        return next(new HttpException(401, 'You have no access to this store'));
      }
    } else {
      return next(new HttpException(401, 'Invalid store'));
    }
  } catch (error) {
    return next(
      new HttpException(401, 'You have no access to perform this action')
    );
  }
}

export default storeMiddleware;
