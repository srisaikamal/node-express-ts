import { genderEnum } from '@utils/constants';
import { Document } from 'mongoose';

export type Gender = typeof genderEnum[number];

export interface Customer {
  name: string;
  phone: string;
  age: number;
  gender: Gender;
  description?: string;
  isDeleted?: boolean;
}

export interface CustomerDocument extends Document, Customer {}
