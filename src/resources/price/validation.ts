import Joi from 'joi';
import { Price } from './interface';

const create = Joi.object<Price>({
  name: Joi.string().required().min(1).label('Category'),
  description: Joi.string().label('Description'),
});

export default { create };
