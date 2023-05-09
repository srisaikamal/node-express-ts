import Joi from 'joi';
import { Prescription } from './interface';

const create = Joi.object<Prescription>({
  combinations: Joi.array()
    .items(
      Joi.object({
        dilutions: Joi.array()
          .items(
            Joi.object({
              dilution: Joi.string().required().label('Dilution'),
            })
          )
          .label('Dilutions'),
        description: Joi.string().label('Combination Description').allow(''),
        tablet: Joi.string().label('Combination Tablet'),
        color: Joi.string().label('Combination Color'),
        pill: Joi.string().label('Combination Pill'),
        price: Joi.string().label('Combination Price'),
        size: Joi.string().label('Combination Size'),
        dosage: Joi.string().label('Combination Dosage'),
        label: Joi.string().label('Combination Label').allow(''),
        type: Joi.string().label('Combination Type'),
      })
    )
    .label('Combinations'),

  patient: Joi.string().required().label('Patient'),
  description: Joi.string().label('Description').allow(''),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().label('Product'),
        isLoose: Joi.boolean().required().label('Is Loose').default(false),
        quantity: Joi.number().required().min(1).label('Product Quantity'),
        size: Joi.string().label('Product Size'),
        price: Joi.string().label('Product Price'),
        dosage: Joi.string().label('Product Dosage'),
        description: Joi.string().label('Product Description').allow(''),
        label: Joi.string().label('Product Label').allow(''),
      }).label('Product')
    )
    .label('Products'),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required().label('Image URL'),
        ref: Joi.string().required().label('Image Reference'),
      })
    )
    .label('Images'),
  date: Joi.string().isoDate().required().label('Date'),
});

export default { create };
