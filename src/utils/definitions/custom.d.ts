import { UserDocument } from '@resources/user/interface';
import { Connection } from 'mongoose';

declare global {
  namespace Express {
    export interface Request {
      user: UserDocument;
      store: string;
      filePath: string;
      db: Connection;
    }
  }
}
