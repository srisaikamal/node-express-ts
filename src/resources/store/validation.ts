import Joi from 'joi';
import { Store } from './interface';

const create = Joi.object<Store>({
  name: Joi.string().required().min(3).label('Name'),
  description: Joi.string().label('Description'),
});

export default { create };
