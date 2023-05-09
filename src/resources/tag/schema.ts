import { Schema } from 'mongoose';
import { Tag } from './interface';

const TagSchema = new Schema<Tag>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default TagSchema;
