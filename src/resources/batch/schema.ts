import { generateRandomSmallString } from '@utils/index';
import { Schema, model } from 'mongoose';
import { BatchDocument, Batch } from './interface';

const BatchSchema = new Schema<Batch>(
  {
    batchId: {
      type: String,
      required: true,
      default: generateRandomSmallString,
    },
    manufacturingDate: { type: Date },
    expiryDate: { type: Date },
    mrp: { type: Number },
    sellingPrice: { type: Number },
    cost: { type: Number },
    costPercent: { type: Number, max: 100, min: 1 },
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
    location: [{ type: String, index: true }],
    stock: { type: Number },
    stockUnit: { type: String },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    size: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default BatchSchema;
