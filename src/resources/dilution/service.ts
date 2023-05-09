import { DilutionDocument, Dilution } from './interface';
import { dilutionListQuery } from './query';
import BatchService from '@resources/batch/service';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class DilutionService {
  private dilution: Model<Dilution>;
  private batchService: BatchService;

  constructor(db: Connection) {
    this.dilution = db.model(MODEL_NAMES.dilution);
    this.batchService = new BatchService(db);
  }

  /**
   * @returns  Created dilution
   */
  public async create(dilution: Dilution): Promise<DilutionDocument> {
    const newDilution: DilutionDocument = await this.dilution.create<Dilution>({
      ...dilution,
    });
    return newDilution;
  }

  /**
   * @param store store id
   * @param offset number of documents to skip
   * @param limit number of documents to limit
   * @returns dilutions list of a store
   */

  public async list(
    search: string,
    offset: number,
    limit: number,
    store: string
  ): Promise<DilutionDocument[]> {
    console.log(search, offset, limit);
    const products = search
      ? await this.batchService.search({
          location: { $regex: search, $options: 'i' },
        })
      : [];
    const productIds = products.map((product) => product.product);
    console.log(productIds);
    const dilutions: DilutionDocument[] = await this.dilution.aggregate(
      dilutionListQuery(productIds, search, offset, limit, store)
    );
    return dilutions;
  }

  /**
   * @param limit page size
   * @param offset number of documents to skip
   * @returns dilutions list of a store
   */

  public async listAll(
    limit: number,
    offset: number,
    search: string
  ): Promise<{ dilutions: DilutionDocument[]; count: number }> {
    const query = {
      name: { $regex: search, $options: 'i' },
    };
    const count = await this.dilution.countDocuments({
      ...query,
    });
    const dilutions: DilutionDocument[] = await this.dilution
      .find({
        ...query,
      })
      .select('MT name _id')
      .skip(offset)
      .limit(limit);
    return { dilutions, count };
  }

  // /**
  //  * @param data string array
  //  */

  // public async addAllDilutions(data: string[][]): Promise<void> {
  //   try {
  //     const createdBy = '629d6139f420c6c5cdf4da0f';
  //     const store = '629d6174f420c6c5cdf4da14';
  //     const category = '629d6845f420c6c5cdf4da29';
  //     const indexMap = {
  //       MT: 6,
  //       '3': 8,
  //       '6': 1,
  //       '12': 8,
  //       '30': 2,
  //       '200': 3,
  //       '1M': 4,
  //       '10M': 5,
  //       '50M': 8,
  //       CM: 8,
  //     };

  //     const getLocations = (locations: string) => {
  //       if (locations) {
  //         const locationArr = locations.split(',');
  //         return locationArr.map((location) =>
  //           location.trim().replace(/\s/g, '')
  //         );
  //       }
  //       return [];
  //     };

  //     for (let i = 0; i < data.length; i++) {
  //       const dilution = data[i];
  //       let productsToBeAdded = Potencies.map((key) => ({
  //         potency: key,
  //         name: dilution[0],
  //         type: 'dilution',
  //         createdBy,
  //         category,
  //       }));
  //       const products: ProductDocument[] = await this.product.insertMany(
  //         productsToBeAdded
  //       );
  //       await this.dilution.create({
  //         name: dilution[0],
  //         category,
  //         createdBy,
  //         ...products.reduce<{ [key: string]: string }>((acc, dilution) => {
  //           if (dilution.potency) {
  //             acc[dilution.potency] = dilution._id;
  //           }
  //           return acc;
  //         }, {}),
  //       });

  //       await this.batch.insertMany(
  //         Potencies.reduce<Batch[]>((acc, potency) => {
  //           const locationStrs = dilution[indexMap[potency]];
  //           if (locationStrs) {
  //             acc = [
  //               ...acc,
  //               ...getLocations(locationStrs).map(
  //                 (location) =>
  //                   ({
  //                     batchId: uuidV4(),
  //                     location: [location],
  //                     createdBy,
  //                     store,
  //                     product: products.find(
  //                       (product) => product.potency === potency
  //                     )?._id,
  //                   } as Batch)
  //               ),
  //             ];
  //           }
  //           return acc;
  //         }, [])
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Error adding dilution');
  //   }
  // }
}

/**
 * @returns dilution service
 */

export default DilutionService;
