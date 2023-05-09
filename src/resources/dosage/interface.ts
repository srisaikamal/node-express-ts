import { Document } from 'mongoose';

export interface Dosage {
  name: string;
  description?: string;
}

export interface DosageDocument extends Document, Dosage {}
