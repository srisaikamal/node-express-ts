import { SizeDocument, Size } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class SizeService {
  private size: Model<Size>;

  constructor(db: Connection) {
    this.size = db.model(MODEL_NAMES.size);
  }

  /**
   * @param name of the size
   * @param description of the size
   * @returns  Created size
   */
  public async create(
    name: string,
    description?: string
  ): Promise<SizeDocument> {
    try {
      const size: SizeDocument = await this.size.create({
        name,
        description,
      });
      return size;
    } catch (error) {
      throw new Error('Error adding size');
    }
  }

  /**
   * @returns sizes list
   */

  public async list(
    query?: Partial<Size & MongooseDefaultFields>
  ): Promise<SizeDocument[]> {
    try {
      const sizes: SizeDocument[] = await this.size.find({
        ...query,
      });
      return sizes;
    } catch (error) {
      throw new Error('Error listing size');
    }
  }
}

export default SizeService;
