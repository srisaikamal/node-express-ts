import AppointmentSchema from '@resources/appointment/schema';
import BatchSchema from '@resources/batch/schema';
import BrandSchema from '@resources/brand/schema';
import CategorySchema from '@resources/category/schema';
import ColorSchema from '@resources/color/schema';
import CommentSchema from '@resources/comment/schema';
import CustomerSchema from '@resources/customer/schema';
import DilutionSchema from '@resources/dilution/schema';
import DosageSchema from '@resources/dosage/schema';
import PillSchema from '@resources/pill/schema';
import PrescriptionSchema from '@resources/prescription/schema';
import PriceSchema from '@resources/price/schema';
import ProductPriceSchema from '@resources/product-price/schema';
import ProductSchema from '@resources/product/schema';
import ReceiptSchema from '@resources/receipt/schema';
import RoleSchema from '@resources/role/schema';
import SaleSchema from '@resources/sale/schema';
import SettingsSchema from '@resources/settings/schema';
import SizeSchema from '@resources/size/schema';
import StoreSchema from '@resources/store/schema';
import TabletSchema from '@resources/tablet/schema';
import TagSchema from '@resources/tag/schema';
import TenantSchema from '@resources/tenant/schema';
import UserSchema from '@resources/user/schema';
import { MODEL_NAMES, PUBLIC_MODEL_NAMES } from '@utils/constants';
import { Schema } from 'mongoose';

export const TENANT_SCHEMAS = new Map<MODEL_NAMES, Schema>([
  [MODEL_NAMES.appointment, AppointmentSchema],
  [MODEL_NAMES.batch, BatchSchema],
  [MODEL_NAMES.brand, BrandSchema],
  [MODEL_NAMES.category, CategorySchema],
  [MODEL_NAMES.color, ColorSchema],
  [MODEL_NAMES.comment, CommentSchema],
  [MODEL_NAMES.customer, CustomerSchema],
  [MODEL_NAMES.dilution, DilutionSchema],
  [MODEL_NAMES.dosage, DosageSchema],
  [MODEL_NAMES.pill, PillSchema],
  [MODEL_NAMES.prescription, PrescriptionSchema],
  [MODEL_NAMES.price, PriceSchema],
  [MODEL_NAMES.product, ProductSchema],
  [MODEL_NAMES.productPrice, ProductPriceSchema],
  [MODEL_NAMES.receipt, ReceiptSchema],
  [MODEL_NAMES.role, RoleSchema],
  [MODEL_NAMES.sale, SaleSchema],
  [MODEL_NAMES.settings, SettingsSchema],
  [MODEL_NAMES.size, SizeSchema],
  [MODEL_NAMES.store, StoreSchema],
  [MODEL_NAMES.tablet, TabletSchema],
  [MODEL_NAMES.tag, TagSchema],
  [MODEL_NAMES.user, UserSchema],
  [MODEL_NAMES.brand, BrandSchema],
]);

export const PUBLIC_SCHEMAS = new Map<PUBLIC_MODEL_NAMES, Schema>([
  [PUBLIC_MODEL_NAMES.tenant, TenantSchema],
  [PUBLIC_MODEL_NAMES.user, UserSchema],
  [PUBLIC_MODEL_NAMES.settings, SettingsSchema],
  [PUBLIC_MODEL_NAMES.role, RoleSchema],
  [PUBLIC_MODEL_NAMES.store, StoreSchema],
]);
