import { Document, SchemaTimestampsConfig } from 'mongoose';

export interface Combination {
  dilutions: {
    dilution: string;
  }[];
  tablet: string;
  color: string;
  description: string;
  pill: string;
  price: string;
  size: string;
  label: string;
  dosage: string;
  type: string;
}

export interface PrescriptionProduct {
  product: string;
  isLoose: boolean;
  quantity: number;
  size: string;
  price: string;
  description: string;
  label: string;
  dosage: string;
}

interface PrescriptionImage {
  url: string;
  ref: string;
}

export interface Prescription {
  combinations: Combination[];
  patient: string;
  description: string;
  products: PrescriptionProduct[];
  createdBy: string;
  images: PrescriptionImage;
  prescriptionId: string;
  isDeleted: boolean;
  date: string | Date;
}

export interface PrescriptionDocument extends Document, Prescription {}
