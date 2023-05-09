export const Potencies = [
  'MT',
  '3',
  '6',
  '12',
  '30',
  '200',
  '1M',
  '10M',
  '50M',
  'CM',
] as const;

export const genderEnum = ['Male', 'Female'] as const;

export const APP_PERMISSIONS = [
  'Inventory',
  'Doctors',
  'Sales',
  'Customers',
  'Reception',
  'Profile',
] as const;

export const ADMIN_PERMISSIONS = ['Tenant'];

export enum MODEL_NAMES {
  appointment = 'Appointment',
  batch = 'Batch',
  category = 'Category',
  color = 'Color',
  comment = 'Comment',
  customer = 'Customer',
  dilution = 'Dilution',
  dosage = 'Dosage',
  pill = 'Pill',
  prescription = 'Prescription',
  price = 'Price',
  product = 'Product',
  productPrice = 'ProductPrice',
  receipt = 'Receipt',
  role = 'Role',
  sale = 'Sale',
  settings = 'Settings',
  size = 'Size',
  store = 'Store',
  tablet = 'Tablet',
  tag = 'Tag',
  user = 'User',
  brand = 'Brand',
}

export enum PUBLIC_MODEL_NAMES {
  tenant = 'Tenant',
  user = 'User',
  settings = 'Settings',
  role = 'Role',
  store = 'Store',
}
