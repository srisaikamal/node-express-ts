import { Schema, model } from 'mongoose';
import { Brand } from './interface';

const BrandSchema = new Schema<Brand>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

model('Brand', BrandSchema, 'Brand');

export default BrandSchema;
