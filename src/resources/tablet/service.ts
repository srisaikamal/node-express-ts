import { TabletDocument, Tablet } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class TabletService {
  private tablet: Model<Tablet>;

  constructor(db: Connection) {
    this.tablet = db.model(MODEL_NAMES.tablet);
  }

  /**
   * @param name of the tablet
   * @param description of the tablet
   * @returns  Created tablet
   */
  public async create(
    name: string,
    description?: string
  ): Promise<TabletDocument> {
    const tablet: TabletDocument = await this.tablet.create({
      name,
      description,
    });
    return tablet;
  }

  /**
   * @returns tablets list
   */

  public async list(
    query?: Partial<Tablet & MongooseDefaultFields>
  ): Promise<TabletDocument[]> {
    const tablets: TabletDocument[] = await this.tablet.find({
      ...query,
    });
    return tablets;
  }
}

export default TabletService;
