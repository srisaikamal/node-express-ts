import { PriceDocument, Price } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class PriceService {
  private price: Model<Price>;

  constructor(db: Connection) {
    this.price = db.model(MODEL_NAMES.price);
  }

  /**
   * @param name of the price
   * @param description of the price
   * @returns  Created price
   */
  public async create(
    name: string,
    description?: string
  ): Promise<PriceDocument> {
    const price: PriceDocument = await this.price.create<Price>({
      name,
      description,
    });
    return price;
  }

  /**
   * @returns categories list
   */

  public async list(
    query?: Partial<Price & MongooseDefaultFields>
  ): Promise<PriceDocument[]> {
    const categories: PriceDocument[] = await this.price.find({
      ...query,
    });
    return categories;
  }
}

export default PriceService;
