import { ProductPriceDocument, ProductPrice } from './interface';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class ProductPriceService {
  private productPrice: Model<ProductPrice>;

  constructor(db: Connection) {
    this.productPrice = db.model(MODEL_NAMES.productPrice);
  }

  /**
   * @param product reference to the product
   * @param size of the product
   * @param productPrice of the product
   * @returns  Created productPrice
   */
  public async create(
    product: string,
    size: string,
    price: number
  ): Promise<ProductPriceDocument> {
    try {
      const productPriceDoc: ProductPriceDocument =
        await this.productPrice.create<ProductPrice>({
          product,
          size,
          price,
        });
      return productPriceDoc;
    } catch (error) {
      throw new Error('Error adding productPrice');
    }
  }

  /**
   * @returns productPrices list
   */

  public async list(
    product: string,
    size: string
  ): Promise<ProductPriceDocument[]> {
    try {
      const productPrices: ProductPriceDocument[] =
        await this.productPrice.find({
          ...(product && { product }),
          ...(size && { size }),
        });
      return productPrices;
    } catch (error) {
      throw new Error('Error listing productPrice');
    }
  }

  /**
   * @param productPrices list of productPrices
   * @returns productPrices list
   */

  public async patchBulk(productPrices?: ProductPrice[]) {
    try {
      const updatedProductPrices = await this.productPrice.bulkWrite(
        productPrices?.map((p) => ({
          updateMany: {
            filter: { product: p.product, size: p.size },
            update: { $set: { price: p.price } },
            upsert: true,
          },
        })) || []
      );
      return updatedProductPrices;
    } catch (error) {
      throw new Error('Error listing productPrice');
    }
  }
}

export default ProductPriceService;
