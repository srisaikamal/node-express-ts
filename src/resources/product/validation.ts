import Joi from 'joi';
import { Image, Product, ProductTypes } from './interface';

const nameValidator = Joi.string().min(2).label('Name');
const productTypesValidator = Joi.string()
  .valid(...Object.keys(ProductTypes))
  .label('Product type');

const createAndUpdate = Joi.object<Product>({
  name: nameValidator.required(),
  description: Joi.string(),
  brand: Joi.string(),
  size: Joi.string(),
  type: productTypesValidator.required(),
  category: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  potencies: Joi.array().items(Joi.string()),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        ref: Joi.string().required(),
      })
    )
    .label('Image'),
});

const patch = Joi.object<Product>({
  name: nameValidator,
  description: Joi.string(),
  brand: Joi.string(),
  size: Joi.string(),
  potency: Joi.string(),
  type: productTypesValidator,
  category: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  potencies: Joi.alternatives().conditional('type', {
    is: 'dilution',
    then: Joi.array()
      .items(Joi.string().required())
      .required()
      .label('Potencies'),
  }),
});

const patchImage = Joi.object<Image>({
  url: Joi.string(),
  ref: Joi.string(),
});

export default { createAndUpdate, patch, patchImage };
