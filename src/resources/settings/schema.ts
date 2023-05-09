import { Schema } from 'mongoose';
import { Settings } from './interface';

const SettingsSchema = new Schema<Settings>(
  {
    name: { type: String, required: true },
    description: { type: String },
    value: { type: Schema.Types.Mixed },
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
  },
  { timestamps: true }
);

export default SettingsSchema;
