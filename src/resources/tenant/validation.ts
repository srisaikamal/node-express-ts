import {
  firstNameValidator,
  passwordValidator,
  usernameValidator,
} from '@resources/user/validation';
import Joi from 'joi';
import { TenantCreateRequest } from './interface';

const create = Joi.object<TenantCreateRequest>({
  name: Joi.string().required().min(1).label('Business'),
  description: Joi.string().label('Description'),
  tenantId: Joi.string().required().label('Business Id'),
  firstUserName: firstNameValidator.label('First Name'),
  firstUserUsername: usernameValidator.label('Username'),
  firstUserPassword: passwordValidator.label('Password'),
  isActive: Joi.boolean().default(true),
  logo: Joi.object({
    ref: Joi.string().required(),
    url: Joi.string().required(),
  }).optional(),
  ownerAddress: Joi.string().optional().label('Owner Address'),
  ownerContact: Joi.string().optional().label('Owner Contact'),
  ownerName: Joi.string().optional().label('Owner Name'),
  subscribedTill: Joi.date().required().label('Subscribed Till'),
  permissions: Joi.array().items(Joi.string().required()).label('Permissions'),
  store: Joi.string().required().label('Store'),
});

export default { create };
