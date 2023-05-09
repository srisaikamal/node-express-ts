import Joi from 'joi';
import { Brand } from './interface';

const create = Joi.object<Brand>({
  name: Joi.string().required().label('Name'),
  description: Joi.string().label('Description'),
});

export default { create };
