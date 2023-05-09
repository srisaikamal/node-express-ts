import { Schema, model } from 'mongoose';
import { Dosage } from './interface';

const DosageSchema = new Schema<Dosage>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default DosageSchema;
