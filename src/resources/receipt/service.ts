import { ReceiptDocument, Receipt, CreateReceipt } from './interface';
import { Sale, SaleDocument } from '@resources/sale/interface';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';
import momentTZ from 'moment-timezone';

class ReceiptService {
  private receipt: Model<Receipt>;
  private sale: Model<Sale>;

  constructor(db: Connection) {
    this.receipt = db.model(MODEL_NAMES.receipt);
    this.sale = db.model(MODEL_NAMES.sale);
  }

  /**
   * @param receipt - Receipt to be created
   * @returns  Created receipt
   */
  public async create(
    receipt: CreateReceipt,
    store: string
  ): Promise<ReceiptDocument> {
    const sales: SaleDocument[] = await this.sale.insertMany(
      receipt.sales.map((sale) => ({
        ...sale,
        createdBy: receipt.createdBy,
        store,
      }))
    );

    const newReceipt: ReceiptDocument = await this.receipt.create({
      ...receipt,
      sales: sales.map((sale: SaleDocument) => sale._id as string),
    });
    return newReceipt;
  }

  /**
   * @returns receipts list
   */

  public async list(
    query: { [key: string]: any },
    orderBy: Record<string, -1 | 1>,
    offset: number,
    limit: number
  ): Promise<{ receipts: ReceiptDocument[]; count: number }> {
    const count = await this.receipt.countDocuments({ ...query });
    const receipts: ReceiptDocument[] = await this.receipt
      .find({
        ...query,
      })
      .populate('sales')
      .populate('customer')
      .sort(orderBy)
      .limit(limit)
      .skip(offset);
    return { receipts, count };
  }

  /**
   * @returns today stats
   */

  public async stats() {
    console.log(
      new Date(momentTZ().tz('Asia/Kolkata').startOf('day').format())
    );
    const today = new Date(
      momentTZ().tz('Asia/Kolkata').startOf('day').format()
    );
    const [{ upiTotal }] = await this.receipt.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          upiTotal: {
            $sum: '$upiAmount',
          },
        },
      },
    ]);

    const [{ cashTotal }] = await this.receipt.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          cashTotal: {
            $sum: '$cashAmount',
          },
        },
      },
    ]);

    const count = await this.receipt.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    return { upiTotal, cashTotal, count };
  }
}

export default ReceiptService;
