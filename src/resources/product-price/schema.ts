import { Schema, model } from 'mongoose';
import { ProductPriceDocument } from './interface';

const ProductPriceSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default ProductPriceSchema;
