import Joi from 'joi';
import { Sale } from './interface';

const create = Joi.object<Sale>({
  product: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  mrp: Joi.number().required(),
  discount: Joi.number().required(),
});

export default { create };
