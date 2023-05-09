import { Document } from 'mongoose';

export interface Brand {
  name: string;
  description: string;
}

export interface BrandDocument extends Document, Brand {}
