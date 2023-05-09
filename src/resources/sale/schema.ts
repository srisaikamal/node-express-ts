import { generateRandomSmallString } from '@utils/index';
import { Schema } from 'mongoose';
import { Sale } from './interface';

const SaleSchema = new Schema<Sale>(
  {
    product: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    mrp: { type: Number },
    discount: { type: Number },
    discountType: { type: String, default: '₹', enum: ['%', '₹'] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
    saleId: {
      type: String,
      default: generateRandomSmallString,
    },
    productType: { type: String },
    size: { type: String },
    potency: { type: String },
    batch: { type: String },
  },
  { timestamps: true }
);

export default SaleSchema;
