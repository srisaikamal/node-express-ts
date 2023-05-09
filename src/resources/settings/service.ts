import { SettingsDocument, Settings } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class SettingsService {
  private settings: Model<Settings>;

  constructor(db: Connection) {
    this.settings = db.model<Settings>(MODEL_NAMES.settings);
  }

  /**
   * @param name name of the settings
   * @param value value of the settings
   * @param store store to which the settings belongs to
   * @param description some description of the settings
   * @returns Created settings
   */

  public async create(
    name: string,
    value: unknown,
    store: string,
    description?: string
  ): Promise<SettingsDocument> {
    const settings: SettingsDocument = await this.settings.create({
      name,
      value,
      store,
      description,
    });
    return settings;
  }

  /**
   * @returns settings list
   */

  public async list(
    query?: Partial<Settings & MongooseDefaultFields>
  ): Promise<SettingsDocument[]> {
    const settings: SettingsDocument[] = await this.settings.find({
      ...query,
    });
    return settings;
  }

  /**
   * @param name name of the settings
   * @param store store id of the settings
   * @returns store's settings document by name
   */

  public async getByName(
    name: string,
    store: string
  ): Promise<SettingsDocument | null> {
    const settingsDoc = await this.settings.findOne({ name, store });
    return settingsDoc;
  }

  /**
   * @param name name of the settings
   * @param value value of the settings
   * @param store store to which the settings belongs to
   * @returns Patched settings
   */
  public async patch(name: string, value: any, store: string) {
    const settingsDoc = await this.settings.findOneAndUpdate(
      { name, store },
      { $set: { value } },
      { upsert: true, new: true }
    );
    return settingsDoc;
  }
}

export default SettingsService;
