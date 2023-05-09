import SaleModel from './schema';
import ReceiptModel from '@resources/receipt/schema';
import { SaleDocument, Sale } from './interface';
import { Connection, isValidObjectId, Model } from 'mongoose';
import { Receipt } from '@resources/receipt/interface';
import { MODEL_NAMES } from '@utils/constants';

class SaleService {
  private sale: Model<Sale>;
  private receipt: Model<Receipt>;

  constructor(db: Connection) {
    this.sale = db.model(MODEL_NAMES.sale);
    this.receipt = db.model(MODEL_NAMES.receipt);
  }

  /**
   * @param Sale document entry
   * @returns  Created Sale document
   */
  public async create(sale: Sale): Promise<SaleDocument> {
    try {
      const saleDocument: SaleDocument = await this.sale.create<Sale>(sale);
      return saleDocument;
    } catch (error) {
      throw new Error('Error adding sale');
    }
  }

  /**
   * @returns List of Sale documents
   */
  public async list(): Promise<SaleDocument[]> {
    try {
      const saleDocuments: SaleDocument[] =
        await this.sale.find<SaleDocument>();
      return saleDocuments;
    } catch (error) {
      throw new Error('Error listing sales');
    }
  }

  /**
   * @param saleId Sale document id
   */
  public async deleteById(saleId: string): Promise<void> {
    try {
      if (!saleId) {
        throw new Error('Sale id is required');
      }

      if (!isValidObjectId(saleId)) {
        throw new Error('Invalid sale id');
      }

      this.receipt.findOneAndUpdate(
        { sales: { $in: [saleId] } },
        { $pull: { templates: { _id: saleId } } },
        { new: true }
      );

      await this.sale.deleteOne({ _id: saleId });
    } catch (error) {
      throw new Error('Error deleting sale');
    }
  }
}

export default SaleService;
