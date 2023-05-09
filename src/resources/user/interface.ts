import { Document } from 'mongoose';

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  stores: string[];
  role: string;
  customer?: string;
}

export interface UserWithMethods extends User {
  isValidPassword: (password: string) => Promise<Error | boolean>;
}

export interface UserDocument extends Document, UserWithMethods {}
