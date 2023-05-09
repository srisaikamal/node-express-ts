import { DosageDocument, Dosage } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class DosageService {
  private dosage: Model<Dosage>;

  constructor(db: Connection) {
    this.dosage = db.model(MODEL_NAMES.dosage);
  }

  /**
   * @param name of the dosage
   * @param description of the dosage
   * @returns  Created dosage
   */
  public async create(
    name: string,
    description?: string
  ): Promise<DosageDocument> {
    try {
      const dosage: DosageDocument = await this.dosage.create<Dosage>({
        name,
        description,
      });
      return dosage;
    } catch (error) {
      throw new Error('Error adding dosage');
    }
  }

  /**
   * @returns dosages list
   */

  public async list(
    query?: Partial<Dosage & MongooseDefaultFields>
  ): Promise<DosageDocument[]> {
    try {
      const dosages: DosageDocument[] = await this.dosage.find({
        ...query,
      });
      return dosages;
    } catch (error) {
      throw new Error('Error listing dosage');
    }
  }
}

export default DosageService;
