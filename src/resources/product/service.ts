import { ProductDocument, Product, Image } from './interface';
import { Connection, Model, UpdateWriteOpResult } from 'mongoose';
import { listProductsQuery } from '@resources/product/query';
import { MODEL_NAMES, Potencies } from '@utils/constants';
import XLSX from 'xlsx';
import fs from 'fs';
import { Dilution } from '@resources/dilution/interface';
import { Brand } from '@resources/brand/interface';
import { Batch } from '@resources/batch/interface';

class ProductService {
  private product: Model<Product>;
  private dilution: Model<Dilution>;
  private brand: Model<Brand>;
  private batch: Model<Batch>;

  constructor(db: Connection) {
    this.product = db.model(MODEL_NAMES.product);
    this.dilution = db.model(MODEL_NAMES.dilution);
    this.brand = db.model(MODEL_NAMES.brand);
    this.batch = db.model(MODEL_NAMES.batch);
  }

  public async getOne(
    productId: string
  ): Promise<ProductDocument | null | Error> {
    const product: ProductDocument | null = await this.product.findById(
      productId
    );
    return product;
  }

  public async list(
    search: string,
    offset: number,
    limit: number,
    type: string,
    store: string
  ): Promise<ProductDocument[] | null | Error> {
    const products: ProductDocument[] = await this.product.aggregate(
      listProductsQuery(search, offset, limit, type, store)
    );
    return products;
  }

  public async search(
    search: string,
    offset: number,
    limit: number,
    type: string
  ) {
    const products = await this.product
      .find({
        ...(type && { type }),
        name: {
          $regex: search,
          $options: 'i',
        },
      })
      .limit(limit)
      .skip(offset);
    return products;
  }

  public async create(
    product: Product
  ): Promise<ProductDocument | ProductDocument[] | Error> {
    try {
      if (product.type === 'dilution') {
        const newDilutions: ProductDocument[] = await this.product.insertMany(
          Potencies.map((potency) => ({
            ...product,
            potency,
          })) || []
        );
        await this.dilution.create({
          name: product.name,
          description: product.description,
          brand: product.brand,
          size: product.size,
          createdBy: product.createdBy,
          category: product.category,
          tags: product.tags,
          ...newDilutions.reduce<{ [key: string]: string }>((acc, dilution) => {
            if (dilution.potency) {
              acc[dilution.potency] = dilution._id;
            }
            return acc;
          }, {}),
        });

        return newDilutions;
      } else {
        const newProduct: ProductDocument = await this.product.create<Product>(
          product
        );
        return newProduct;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Unable to add product');
    }
  }

  public async update(
    product: Product,
    productId: string
  ): Promise<UpdateWriteOpResult | Error> {
    try {
      const updateResponse = await this.product.updateOne<Product>(
        { _id: productId },
        product
      );
      return updateResponse;
    } catch (error) {
      throw new Error('Unable to add product');
    }
  }

  public async patch(
    product: Partial<Product>,
    productId: string
  ): Promise<Partial<Product> | null | Error> {
    try {
      const patchResponse: Partial<Product> | null =
        await this.product.findByIdAndUpdate<Partial<Product>>(productId, {
          $set: { ...product },
        });
      return patchResponse;
    } catch (error) {
      throw new Error('Unable to patch product');
    }
  }

  public async patchImage(
    image: Image,
    productId: string
  ): Promise<Product | null | Error> {
    try {
      const product: ProductDocument | null =
        await this.product.findById<ProductDocument>(productId);
      if (product) {
        product.images = [...product.images, image];
        await product.save();
        return product;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Unable to patch product');
    }
  }

  public async deleteById(productId: string): Promise<undefined | Error> {
    try {
      await this.product.updateOne(
        {
          _id: productId,
        },
        {
          isDeleted: true,
        }
      );
      return;
    } catch (error) {
      throw new Error('Unable to delete product');
    }
  }

  public async deleteImage(
    productId: string,
    imageIndex: number
  ): Promise<ProductDocument | null | Error> {
    let product = await this.product.findOne({
      _id: productId,
    });

    if (product === null) {
      return product;
    }

    product.images.splice(imageIndex, 1);
    await product.save();
    return product;
  }

  public async getAllBrands(brands: string[]) {
    const brandsGiven = [...new Set(brands.filter((b) => !!b))];
    let allBrands = await this.brand.find().lean();
    const brandsNotAdded = brandsGiven.filter(
      (b) => !allBrands.some((brand) => brand.name === b)
    );
    const createdBrands = brandsNotAdded.length
      ? await this.brand.insertMany(brandsNotAdded.map((b) => ({ name: b })))
      : [];
    allBrands = allBrands.concat(createdBrands);
    return allBrands;
  }

  public async bulkUpload(filePath: string, createdBy: string, store: string) {
    var wb = XLSX.readFile(filePath, { cellDates: true });
    let data = XLSX.utils
      .sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
        header: 1,
      })
      .slice(1) as string[][];
    fs.unlinkSync(filePath);
    const brands = await this.getAllBrands(data.map((d) => d[3]));
    let dataToAdd: { products: any[]; batches: any[] } = {
      products: [],
      batches: [],
    };
    for (let i = 0; i < data.length; i++) {
      const product = data[i];
      if (product[0] && product[1]) {
        let productToAdd: any = await this.product
          .findOne({ name: product[0], isDeleted: { $ne: true } })
          .lean();
        if (!productToAdd) {
          productToAdd = new this.product({
            name: product[0],
            brand: brands.find((v) => v.name === product[3])?.name,
            type: 'product',
            createdBy,
            store,
          });
          dataToAdd.products.push(productToAdd);
        }

        const batchToAdd = new this.batch({
          product: productToAdd._id,
          expiryDate: product[2],
          mrp: product[1],
          sellingPrice: product[1],
          stock: product[5],
          discount: product[4],
          location: [product[6]],
          store,
        });
        dataToAdd.batches.push(batchToAdd);
      }
    }

    const insertedProducts = this.product.insertMany(dataToAdd.products);
    const insertedBatches = this.batch.insertMany(dataToAdd.batches);
    return { products: insertedProducts, batches: insertedBatches };
  }
}

export default ProductService;
