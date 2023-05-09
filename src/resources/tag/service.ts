import TagSchema from './schema';
import { TagDocument, Tag } from './interface';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class TagService {
  private tag: Model<Tag>;

  constructor(db: Connection) {
    this.tag = db.model(MODEL_NAMES.tag);
  }

  /**
   *
   * @param name of the tag
   * @param description of the tag
   * @returns  Created tag
   */
  public async create(name: string, description: string): Promise<TagDocument> {
    try {
      const tag: TagDocument = await this.tag.create({
        name,
        description,
      });
      return tag;
    } catch (error) {
      throw new Error('Error adding tag');
    }
  }

  public async list(): Promise<TagDocument[]> {
    try {
      const tags: TagDocument[] = await this.tag.find();
      return tags;
    } catch (error) {
      throw new Error('Error listing tags');
    }
  }
}

export default TagService;
