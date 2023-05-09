import StoreSchema from './schema';
import { Store, StoreDocument } from './interface';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class StoreService {
  private store: Model<Store>;

  constructor(db: Connection) {
    this.store = db.model(MODEL_NAMES.store);
  }

  /**
   *
   * @param name of the store
   * @param description of the store
   * @returns  Created store
   */
  public async create(
    name: string,
    description?: string
  ): Promise<StoreDocument> {
    try {
      const store: StoreDocument = await this.store.create<Store>({
        name,
        description,
      });
      return store;
    } catch (error) {
      throw new Error('Error adding store');
    }
  }

  public async list(): Promise<StoreDocument[]> {
    try {
      const stores: StoreDocument[] = await this.store.find({});
      return stores;
    } catch (error) {
      throw new Error('Error adding store');
    }
  }
}

export default StoreService;
