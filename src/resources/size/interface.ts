import { Document } from 'mongoose';

export interface Size {
  name: string;
  description?: string;
}

export interface SizeDocument extends Document, Size {}
