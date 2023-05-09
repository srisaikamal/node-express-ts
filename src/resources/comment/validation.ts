import Joi from 'joi';
import { Comment } from './interface';

const create = Joi.object<Comment>({
  prescription: Joi.string().label('Prescription'),
  comment: Joi.string().label('Comment'),
  url: Joi.string().label('Image URL'),
  ref: Joi.string().label('Ref'),
});

export default { create };
