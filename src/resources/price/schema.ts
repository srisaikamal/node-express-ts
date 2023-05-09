import { Schema, model } from 'mongoose';
import { Price, PriceDocument } from './interface';

const PriceSchema = new Schema<Price>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default PriceSchema;
