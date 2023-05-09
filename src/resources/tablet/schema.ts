import { Schema } from 'mongoose';
import { Tablet } from './interface';

const TabletSchema = new Schema<Tablet>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default TabletSchema;
