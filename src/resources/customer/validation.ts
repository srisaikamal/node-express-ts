import { genderEnum } from '@utils/constants';
import Joi from 'joi';
import { Customer } from './interface';

const create = Joi.object<Customer>({
  name: Joi.string().required().min(1).label('Category'),
  description: Joi.string().label('Description'),
  phone: Joi.string().required().min(10).label('Phone'),
  age: Joi.number().required().min(1).label('Age'),
  gender: Joi.string()
    .required()
    .valid(...genderEnum)
    .label('Gender'),
});

export default { create };
