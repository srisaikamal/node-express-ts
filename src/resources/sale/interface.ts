import { Document } from 'mongoose';

export interface Sale {
  saleId: string;
  product: string;
  quantity: number;
  price: number;
  mrp: number;
  discount: number;
  store: string;
  createdBy: string;
  productType: string;
  size: string;
  potency: string;
  batch: string;
  discountType: string;
}

export interface SaleDocument extends Document, Sale {}
