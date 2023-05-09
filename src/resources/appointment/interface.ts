import { Document } from 'mongoose';

export interface Appointment {
  doctor: string;
  customer: string;
  createdBy: string;
  isCompleted?: boolean;
  date: Date;
}

export interface AppointmentDocument extends Document, Appointment {}
