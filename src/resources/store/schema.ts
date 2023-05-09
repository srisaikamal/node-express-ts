import { Schema } from 'mongoose';
import { Store } from './interface';

const StoreSchema = new Schema<Store>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default StoreSchema;
