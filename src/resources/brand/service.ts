import { Brand, BrandDocument } from './interface';
import mongoose, { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class BrandService {
  private brand: Model<Brand>;

  constructor(db: Connection) {
    this.brand = db.model(MODEL_NAMES.brand);
  }

  /**
   *
   * @param name name of the brand
   * @param description description of the brand
   * @returns newly Created brand
   */
  public async create(
    name: string,
    description?: string
  ): Promise<BrandDocument> {
    const brand: BrandDocument = await this.brand.create({
      name,
      description,
    });
    return brand;
  }

  /**
   *
   * @returns list of all brands
   */
  public async list(): Promise<BrandDocument[]> {
    const brands = await this.brand.find();
    return brands;
  }
}

export default BrandService;
