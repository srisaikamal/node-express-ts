import { Document } from 'mongoose';

export interface Tablet {
  name: string;
  description?: string;
}

export interface TabletDocument extends Document, Tablet {}
