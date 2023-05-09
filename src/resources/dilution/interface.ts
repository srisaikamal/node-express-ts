import { Document } from 'mongoose';

export interface Dilution {
  name: string;
  description?: string;
  brand?: string;
  size?: string;
  createdBy: string;
  MT: string;
  '3': string;
  '6': string;
  '12': string;
  '30': string;
  '200': string;
  '1M': string;
  '10M': string;
  '50M': string;
  CM: string;
}

export interface DilutionDocument extends Document, Dilution {}
