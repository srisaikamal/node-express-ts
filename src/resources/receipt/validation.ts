import Joi from 'joi';
import { Receipt } from './interface';

const create = Joi.object<Receipt>({
  customer: Joi.string().required(),
  discount: Joi.number(),
  total: Joi.number(),
  date: Joi.date().iso(),
  sales: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(1).required(),
      discount: Joi.number(),
    })
  ),
  discountType: Joi.string(),
  isDraft: Joi.boolean(),
  cashAmount: Joi.number().default(0),
  upiAmount: Joi.number().default(0),
});

export default { create };
