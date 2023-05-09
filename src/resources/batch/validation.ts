import Joi from 'joi';
import { Batch } from './interface';

const create = Joi.object<Batch>({
  mrp: Joi.number().min(1).label('MRP').positive(),
  sellingPrice: Joi.number().min(1).label('Selling Price').positive(),
  cost: Joi.number().min(1).label('Cost').positive(),
  costPercent: Joi.number().min(1).max(100).label('Cost Percent').positive(),
  stock: Joi.number().min(1).label('Stock').positive(),
  product: Joi.string().required().label('Product'),
  location: Joi.array().items(Joi.string()).required().label('Location'),
  batchId: Joi.string().required().min(1).label('Batch Id'),
  size: Joi.string().label('Size'),
  expiryDate: Joi.string().isoDate().label('Expiry Date'),
  manufacturingDate: Joi.string().isoDate().label('Manufacturing Date'),
  stockUnit: Joi.string().label('Stock Unit'),
});

const put = Joi.object<Batch>({
  mrp: Joi.number().min(1).label('MRP').positive(),
  sellingPrice: Joi.number().min(1).label('Selling Price').positive(),
  cost: Joi.number().min(1).label('Cost').positive(),
  costPercent: Joi.number().min(1).label('Cost Percent').positive(),
  stock: Joi.number().min(1).label('Stock').positive(),
  size: Joi.string().label('Size'),
  location: Joi.array().items(Joi.string()).required().label('Location'),
});

export default { create, put };
