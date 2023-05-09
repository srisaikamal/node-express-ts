import { Document } from 'mongoose';

export interface Color {
  name: string;
  description?: string;
}

export interface ColorDocument extends Document, Color {}
