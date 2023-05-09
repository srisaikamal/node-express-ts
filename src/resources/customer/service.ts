import { CustomerDocument, Customer, Gender } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class CustomerService {
  private customer: Model<Customer>;

  constructor(db: Connection) {
    this.customer = db.model(MODEL_NAMES.customer);
  }

  /**
   * @param name of the customer
   * @param description of the customer
   * @returns  Created customer
   */
  public async create(
    name: string,
    phone: string,
    age: number,
    gender: Gender
  ): Promise<CustomerDocument> {
    const customer: CustomerDocument = await this.customer.create({
      name,
      phone,
      age,
      gender,
    });

    return customer;
  }

  /**
   * @returns customers list
   */

  public async list(
    query?: Partial<Customer & MongooseDefaultFields>
  ): Promise<CustomerDocument[]> {
    const customers: CustomerDocument[] = await this.customer
      .find({
        ...query,
        isDeleted: { $ne: true },
      })
      .sort({ createdAt: -1 });
    return customers;
  }

  public async getById(id: string): Promise<CustomerDocument | null> {
    const customer: CustomerDocument | null = await this.customer.findById(id);
    return customer;
  }

  public async patchCustomer(
    customer: Partial<Customer>,
    id: string
  ): Promise<CustomerDocument | null> {
    const updatedCustomer: CustomerDocument | null =
      await this.customer.findByIdAndUpdate(
        id,
        {
          $set: customer,
        },
        {
          new: true,
        }
      );
    return updatedCustomer;
  }

  public async deleteCustomer(id: string): Promise<CustomerDocument | null> {
    const updatedCustomer: CustomerDocument | null =
      await this.customer.findByIdAndUpdate(
        id,
        {
          $set: { isDeleted: true },
        },
        {
          new: true,
        }
      );
    return updatedCustomer;
  }

  public async getFamily(id: string): Promise<CustomerDocument[]> {
    const customer = await this.customer.findById(id);
    if (customer) {
      const family = await this.customer.find({
        phone: customer.phone,
        _id: { $nin: [id] },
      });
      return family;
    }
    throw new Error('Customer does not exist');
  }
}

export default CustomerService;
