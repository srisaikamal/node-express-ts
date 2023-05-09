import { Schema } from 'mongoose';
import { Tenant } from './interface';

const TenantSchema = new Schema<Tenant>(
  {
    name: { type: String, required: true },
    description: { type: String },
    tenantId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    subscribedTill: { type: Date },
    logo: {
      ref: { type: String },
      url: { type: String },
    },
    ownerName: { type: String },
    ownerContact: { type: String },
    ownerAddress: { type: String },
  },
  { timestamps: true }
);

export default TenantSchema;
