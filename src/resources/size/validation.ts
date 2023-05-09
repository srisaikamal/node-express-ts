import Joi from 'joi';
import { Size } from './interface';

const create = Joi.object<Size>({
  name: Joi.string().required().min(1).label('Size'),
  description: Joi.string().label('Description'),
});

export default { create };
