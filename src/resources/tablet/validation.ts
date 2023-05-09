import Joi from 'joi';
import { Tablet } from './interface';

const create = Joi.object<Tablet>({
  name: Joi.string().required().min(1).label('Tablet'),
  description: Joi.string().label('Description'),
});

export default { create };
