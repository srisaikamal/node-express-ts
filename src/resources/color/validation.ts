import Joi from 'joi';
import { Color } from './interface';

const create = Joi.object<Color>({
  name: Joi.string().required().min(1).label('Color'),
  description: Joi.string().label('Description'),
});

export default { create };
