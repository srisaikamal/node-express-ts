import { Potencies } from '@utils/constants';
import { Document } from 'mongoose';

export enum ProductTypes {
  'dilution' = 'Dilution',
  'product' = 'Product',
}

export interface Image {
  url: string;
  ref: string;
}

export interface Product {
  name: string;
  description: string;
  brand: string;
  size: string;
  potency: typeof Potencies[number];
  type: keyof typeof ProductTypes;
  category: string;
  tags: string[];
  potencies?: string[];
  createdBy: string;
  images: Image[];
  units: string;
  isDeleted: boolean;
}

export interface ProductDocument extends Document, Product {}
