import Joi from 'joi';
import { Dosage } from './interface';

const create = Joi.object<Dosage>({
  name: Joi.string().required().min(1).label('Price'),
  description: Joi.string().label('Description'),
});

export default { create };
