import { ColorDocument, Color } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class ColorService {
  private color: Model<Color>;

  constructor(db: Connection) {
    this.color = db.model(MODEL_NAMES.color);
  }

  /**
   * @param name of the color
   * @param description of the color
   * @returns  Created color
   */
  public async create(
    name: string,
    description?: string
  ): Promise<ColorDocument> {
    const color: ColorDocument = await this.color.create({
      name,
      description,
    });
    return color;
  }

  /**
   * @returns colors list
   */

  public async list(
    query?: Partial<Color & MongooseDefaultFields>
  ): Promise<ColorDocument[]> {
    const colors: ColorDocument[] = await this.color.find({
      ...query,
    });
    return colors;
  }
}

export default ColorService;
