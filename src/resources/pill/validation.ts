import Joi from 'joi';
import { Pill } from './interface';

const create = Joi.object<Pill>({
  name: Joi.string().required().min(1).label('Pill'),
  description: Joi.string().label('Description'),
});

export default { create };
