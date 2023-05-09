import Joi from 'joi';
import { Settings } from './interface';

const create = Joi.object<Settings>({
  name: Joi.string().required().min(1).label('Settings Name'),
  description: Joi.string().label('Description'),
  value: Joi.any().label('Value'),
});

export default { create };
