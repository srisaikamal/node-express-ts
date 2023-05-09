import { Potencies } from '@utils/constants';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

// dilution list of a store
export const dilutionListQuery = (
  productIds: string[],
  search: string,
  offset: number,
  limit: number,
  store: string
) => [
  {
    $match: {
      $or: [
        ...Potencies.map((potency) => ({
          [potency]: { $in: productIds },
        })),
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
      ],
    },
  },
  {
    $skip: offset,
  },
  {
    $limit: limit,
  },
  {
    $lookup: {
      from: 'Tag',
      localField: 'tags',
      foreignField: '_id',
      as: 'tags',
      pipeline: [
        {
          $project: {
            name: 1,
          },
        },
      ],
    },
  },
  {
    $lookup: {
      from: 'Category',
      localField: 'category',
      foreignField: '_id',
      as: 'category',
      pipeline: [
        {
          $project: {
            name: 1,
          },
        },
      ],
    },
  },
  {
    $unwind: '$category',
  },
  ...Potencies.map((potency) => ({
    $lookup: {
      from: 'Batch',
      localField: potency,
      foreignField: 'product',
      as: potency + ' batches',
      pipeline: [
        {
          $match: {
            store: new ObjectId(store),
          },
        },
        {
          $project: {
            product: 1,
            location: 1,
          },
        },
      ],
    },
  })),
];
