import Joi from 'joi';
import { Role } from './interface';

const create = Joi.object<Role>({
  name: Joi.string().required().min(1).label('Role'),
  description: Joi.string().label('Description'),
  permissions: Joi.array()
    .items(Joi.string().required())
    .required()
    .label('Permissions'),
});

export default { create };
