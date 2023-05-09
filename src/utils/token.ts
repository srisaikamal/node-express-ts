import jwt from 'jsonwebtoken';
import { UserDocument } from '@resources/user/interface';
import Token from '@utils/interfaces/token';

/**
 * creates a new token
 * @param user loggedin user
 * @param isRememberEnabled toggle to enable or disable expiryDate
 * @returns token created
 */

export const createToken = (
  user: Record<string, unknown>,
  isRememberEnabled: boolean
): string =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET as jwt.Secret, {
    ...(!isRememberEnabled && { expiresIn: '1d' }),
  });

/**
 *  verifies the jwt token
 * @param token JWT token sent via request
 * @returns Promise with errors or token data
 */

export const verifyToken = async (
  token: string
): Promise<jwt.VerifyErrors | Token> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload as Token);
    });
  });
