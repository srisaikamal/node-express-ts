import { Document } from 'mongoose';

export interface Pill {
  name: string;
  description?: string;
}

export interface PillDocument extends Document, Pill {}
