import Joi from 'joi';
import { ProductPrice } from './interface';

const create = Joi.object<ProductPrice>({
  product: Joi.string().required().label('Product'),
  size: Joi.string().required().label('Size'),
  price: Joi.number().min(1).required().label('Price'),
});

const bulkPatch = Joi.object({
  prices: Joi.array().items(create),
});

export default { create, bulkPatch };
