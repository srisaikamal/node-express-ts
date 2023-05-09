import { ADMIN_PERMISSIONS, APP_PERMISSIONS } from '@utils/constants';
import { Schema } from 'mongoose';
import { Role } from './interface';

const RoleSchema = new Schema<Role>(
  {
    name: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default RoleSchema;
