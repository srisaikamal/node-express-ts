import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@utils/token';
import Token from '@utils/interfaces/token';
import HttpException from '@utils/exceptions/http';
import jwt from 'jsonwebtoken';
import { UserWithMethods } from '@resources/user/interface';

async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(
      new HttpException(401, 'You have no access to perform this action')
    );
  }

  const accessToken = bearer.split('Bearer ')[1].trim();
  try {
    const payload: Token | jwt.VerifyErrors = await verifyToken(accessToken);

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(
        new HttpException(401, 'You have no access to perform this action')
      );
    }

    const UserModel = req.db.model<UserWithMethods>('User');

    const user = await UserModel.findById(payload.id)
      .select('-password')
      .exec();

    if (!user) {
      return next(
        new HttpException(401, 'You have no access to perform this action')
      );
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(
      new HttpException(401, 'You have no access to perform this action')
    );
  }
}

export default authenticationMiddleware;
