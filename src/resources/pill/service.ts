import { PillDocument, Pill } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class PillService {
  private pill: Model<Pill>;

  constructor(db: Connection) {
    this.pill = db.model(MODEL_NAMES.pill);
  }

  /**
   * @param name of the pill
   * @param description of the pill
   * @returns  Created pill
   */
  public async create(
    name: string,
    description?: string
  ): Promise<PillDocument> {
    try {
      const pill: PillDocument = await this.pill.create({
        name,
        description,
      });
      return pill;
    } catch (error) {
      throw new Error('Error adding pill');
    }
  }

  /**
   * @returns pills list
   */

  public async list(
    query?: Partial<Pill & MongooseDefaultFields>
  ): Promise<PillDocument[]> {
    try {
      const pills: PillDocument[] = await this.pill.find({
        ...query,
      });
      return pills;
    } catch (error) {
      throw new Error('Error listing pill');
    }
  }
}

export default PillService;
