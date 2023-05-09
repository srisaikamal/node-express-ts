import { CategoryDocument, Category } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class CategoryService {
  private category: Model<Category>;

  constructor(db: Connection) {
    this.category = db.model(MODEL_NAMES.category);
  }

  /**
   * @param name of the category
   * @param description of the category
   * @returns  Created category
   */
  public async create(
    name: string,
    description?: string
  ): Promise<CategoryDocument> {
    const category: CategoryDocument = await this.category.create({
      name,
      description,
    });
    return category;
  }

  /**
   * @returns categories list
   */

  public async list(
    query?: Partial<Category & MongooseDefaultFields>
  ): Promise<CategoryDocument[]> {
    const categories: CategoryDocument[] = await this.category.find({
      ...query,
    });
    return categories;
  }
}

export default CategoryService;
