import { Document } from 'mongoose';

export interface ProductPrice {
  product: string;
  size: string;
  price: number;
}

export interface ProductPriceDocument extends Document, ProductPrice {}
