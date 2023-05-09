import { BatchDocument, Batch } from './interface';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class BatchService {
  private batch: Model<Batch>;

  constructor(db: Connection) {
    this.batch = db.model(MODEL_NAMES.batch);
  }

  /**
   * @param batch new batch entry
   * @returns Created batch of a product
   */
  public async create(batch: Batch): Promise<BatchDocument> {
    const newBatch: BatchDocument = await this.batch.create({
      ...batch,
    });
    return newBatch;
  }

  /**
   * @param batch uodated batch entry
   * @param id batch id
   */
  public async put(batch: Batch, batchId: string): Promise<void> {
    await this.batch.updateOne(
      { _id: batchId },
      {
        $set: batch,
      }
    );
  }

  /**
   * @returns batches list
   */

  public async list(query?: any): Promise<BatchDocument[]> {
    const batches: BatchDocument[] = await this.batch
      .find({
        ...query,
      })
      .sort({ createdAt: 1 });
    return batches;
  }

  /**
   * @returns batches search
   */

  public async search(query?: Record<string, any>): Promise<BatchDocument[]> {
    const batches: BatchDocument[] = await this.batch.find({
      ...query,
    });
    return batches;
  }

  /**
   * @param id batch id
   * @returns batch by id
   */

  public async getById(id: string) {
    const batch: BatchDocument | null = await this.batch.findById(id);
    return batch;
  }
}

export default BatchService;
