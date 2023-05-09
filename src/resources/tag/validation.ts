import Joi from 'joi';
import { Tag } from './interface';

const create = Joi.object<Tag>({
  name: Joi.string().required().label('Tag'),
  description: Joi.string().label('Tag description'),
});

export default { create };
