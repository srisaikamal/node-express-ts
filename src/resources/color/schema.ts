import { Schema } from 'mongoose';
import { Color } from './interface';

const ColorSchema = new Schema<Color>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default ColorSchema;
