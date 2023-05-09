import { Schema } from 'mongoose';
import { Size } from './interface';

const SizeSchema = new Schema<Size>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default SizeSchema;
