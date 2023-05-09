import { Document } from 'mongoose';

export interface Tenant {
  name: string;
  description?: string;
  tenantId: string;
  isActive: boolean;
  isDeleted: boolean;
  subscribedTill: string | Date;
  logo?: {
    ref: string;
    url: string;
  };
  ownerName?: string;
  ownerContact?: string;
  ownerAddress?: string;
}

export interface TenantCreateRequest {
  name: string;
  tenantId: string;
  isActive: boolean;
  subscribedTill: string;
  ownerName: string;
  ownerContact: string;
  ownerAddress: string;
  description: string;
  permissions: string[];
  firstUserName: string;
  firstUserUsername: string;
  firstUserPassword: string;
  store: string;
  logo: {
    ref: string;
    url: string;
  };
}

export interface TenantDocument extends Document, Tenant {}
