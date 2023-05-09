import { Potencies } from '@utils/constants';
import { Schema, model } from 'mongoose';
import { Product, ProductDocument, ProductTypes } from './interface';

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String },
    brand: { type: String },
    size: { type: String },
    potency: { type: String, enum: Potencies },
    type: {
      type: String,
      enum: [...Object.keys(ProductTypes)],
      default: 'product',
      required: true,
      trim: true,
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    units: { type: String, default: 'ml' },
    images: [
      {
        url: {
          type: String,
          trim: true,
        },
        ref: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default ProductSchema;
