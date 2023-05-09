import { genderEnum } from '@utils/constants';
import { Schema } from 'mongoose';
import { Customer } from './interface';

const CustomerSchema = new Schema<Customer>(
  {
    name: { type: String, required: true },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: genderEnum },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default CustomerSchema;
