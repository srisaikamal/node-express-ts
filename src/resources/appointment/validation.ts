import Joi from 'joi';
import { Appointment } from './interface';

const create = Joi.object<Appointment>({
  doctor: Joi.string().required().min(1).label('Doctor'),
  customer: Joi.string().required().label('Patient'),
  date: Joi.date().iso().required().label('Date'),
});

export default { create };
