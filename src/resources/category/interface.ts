import { Document } from 'mongoose';

export interface Category {
  name: string;
  description?: string;
}

export interface CategoryDocument extends Document, Category {}
