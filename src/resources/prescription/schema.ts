import { generateRandomSmallString } from '@utils/index';
import { Schema, model } from 'mongoose';
import { Prescription, PrescriptionDocument } from './interface';

const PrescriptionSchema = new Schema<Prescription>(
  {
    prescriptionId: {
      type: String,
      default: generateRandomSmallString,
    },
    combinations: [
      {
        dilutions: [
          {
            dilution: { type: Schema.Types.ObjectId, ref: 'Product' },
          },
        ],
        description: { type: String },
        tablet: { type: String },
        color: { type: String },
        pill: { type: String },
        price: { type: String },
        size: { type: String },
        dosage: { type: String },
        label: { type: String },
        type: { type: String, default: 'Tabs' },
      },
    ],
    patient: { type: Schema.Types.ObjectId, ref: 'Customer' },
    description: { type: String },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        isLoose: { type: Boolean, default: false },
        quantity: { type: Number },
        size: { type: String },
        price: { type: String },
        dosage: { type: String },
        description: { type: String },
        label: { type: String },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [
      {
        url: { type: String },
        ref: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    date: {
      type: Date,
      default: function () {
        return this.createdAt;
      },
    },
  },
  { timestamps: true }
);

PrescriptionSchema.virtual('products.stock', {
  ref: 'Batch',
  localField: 'products.product',
  foreignField: 'product',
  options: {
    select: 'location',
  },
});

PrescriptionSchema.virtual('combinations.dilutions.stock', {
  ref: 'Batch',
  localField: 'combinations.dilutions.dilution',
  foreignField: 'product',
  options: {
    select: 'location',
  },
});

PrescriptionSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'prescription',
  as: 'comments',
  options: {
    populate: { path: 'createdBy', select: 'firstName' },
  },
});

export default PrescriptionSchema;
