import { Document } from 'mongoose';

export interface Price {
  name: string;
  description?: string;
}

export interface PriceDocument extends Document, Price {}
