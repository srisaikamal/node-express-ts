import { Sale } from '@resources/sale/interface';
import { Document } from 'mongoose';

export interface Receipt {
  customer: string;
  discount: number;
  total: number;
  sales: string[];
  createdBy: string;
  receiptId: string;
  isDraft: boolean;
  discountType: string;
  upiAmount: number;
  cashAmount: number;
  date: Date;
}

export type CreateReceipt = Omit<Receipt, 'sales'> & {
  sales: Sale[];
};

export interface ReceiptDocument extends Document, Receipt {}
