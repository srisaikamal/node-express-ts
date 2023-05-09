import { Schema } from 'mongoose';
import { Appointment } from './interface';

const AppointmentSchema = new Schema<Appointment>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    isCompleted: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

export default AppointmentSchema;
