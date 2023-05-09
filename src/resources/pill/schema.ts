import { Schema } from 'mongoose';

const PillSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default PillSchema;
