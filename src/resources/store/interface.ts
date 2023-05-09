import { Document } from 'mongoose';

export interface Store {
  name: string;
  description?: string;
}

export interface StoreDocument extends Document, Store {}
