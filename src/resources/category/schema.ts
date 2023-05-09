import { Schema } from 'mongoose';
import { Category } from './interface';

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default CategorySchema;
