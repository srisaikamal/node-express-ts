import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const listProductsQuery = (
  search: string,
  offset: number,
  limit: number,
  type: string,
  store: string
) => [
  {
    $match: {
      ...(type && { type }),
      isDeleted: { $ne: true },
      name: {
        $regex: search,
        $options: 'i',
      },
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
    $addFields: {
      category: { $arrayElemAt: ['$category', 0] },
    },
  },
  {
    $lookup: {
      from: 'Batch',
      localField: '_id',
      foreignField: 'product',
      as: 'batches',
      pipeline: [
        {
          $match: {
            store: new ObjectId(store),
          },
        },
        {
          $project: {
            location: 1,
            stock: 1,
            store: 1,
            createdAt: 1,
          },
        },
      ],
    },
  },
  {
    $addFields: {
      storeBatches: {
        $reduce: {
          input: '$batches',
          initialValue: {
            stock: 0,
            location: [],
            createdAt: new Date(1),
          },
          in: {
            stock: { $add: ['$$value.stock', '$$this.stock'] },
            location: {
              $concatArrays: ['$$this.location', '$$value.location'],
            },
            createdAt: {
              $max: ['$$value.createdAt', '$$this.createdAt'],
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      stock: '$storeBatches.stock',
      location: {
        $setUnion: {
          $reduce: {
            input: '$storeBatches.location',
            initialValue: [],
            in: { $concatArrays: ['$$value', ['$$this']] },
          },
        },
      },
    },
  },
  { $unset: ['storeBatches', 'batches'] },
];
