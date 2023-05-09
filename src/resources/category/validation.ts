import Joi from 'joi';
import { Category } from './interface';

const create = Joi.object<Category>({
  name: Joi.string().required().min(1).label('Category'),
  description: Joi.string().label('Description'),
});

export default { create };
