import { Schema, model } from 'mongoose';
import { Receipt, ReceiptDocument } from './interface';

const ReceiptSchema = new Schema<Receipt>(
  {
    receiptId: {
      type: String,
      required: true,
      default: () => Math.round(Date.now()).toString(36),
    },
    date: { type: Date, required: true, default: Date.now },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    discount: { type: Number, default: 0 },
    total: { type: Number },
    sales: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Sale',
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDraft: { type: Boolean, default: false },
    discountType: { type: String, default: '₹', enum: ['%', '₹'] },
    upiAmount: { type: Number, default: 0 },
    cashAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default ReceiptSchema;
