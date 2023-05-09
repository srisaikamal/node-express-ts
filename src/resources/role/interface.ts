import { Document } from 'mongoose';

export interface Role {
  name: string;
  description?: string;
  permissions: string[];
  isDeleted: boolean;
}

export interface RoleDocument extends Document, Role {}
