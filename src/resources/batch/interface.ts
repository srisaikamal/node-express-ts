import { Document } from 'mongoose';

export interface Batch {
  batchId: string;
  manufacturingDate?: string;
  expiryDate?: string;
  mrp?: number;
  sellingPrice?: number;
  cost: number;
  costPercent: number;
  location?: string[];
  stock?: number;
  stockUnit?: string;
  product: string;
  size?: string;
  createdBy: string;
  store: string;
}

export interface BatchDocument extends Document, Batch {}
