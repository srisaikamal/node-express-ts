import mongoose, { Schema } from 'mongoose';
import { Dilution } from './interface';

const DilutionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, index: true },
    brand: { type: String },
    size: { type: String },
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    MT: { type: mongoose.Types.ObjectId, ref: 'Product' },
    '3': { type: mongoose.Types.ObjectId, ref: 'Product' },
    '6': { type: mongoose.Types.ObjectId, ref: 'Product' },
    '12': { type: mongoose.Types.ObjectId, ref: 'Product' },
    '30': { type: mongoose.Types.ObjectId, ref: 'Product' },
    '200': { type: mongoose.Types.ObjectId, ref: 'Product' },
    '1M': { type: mongoose.Types.ObjectId, ref: 'Product' },
    '10M': { type: mongoose.Types.ObjectId, ref: 'Product' },
    '50M': { type: mongoose.Types.ObjectId, ref: 'Product' },
    CM: { type: mongoose.Types.ObjectId, ref: 'Product' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

export default DilutionSchema;
