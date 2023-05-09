import PrescriptionModel from './schema';
import { PrescriptionDocument, Prescription } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import AppointmentService from '@resources/appointment/service';
import momentTZ from 'moment-timezone';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class PrescriptionService {
  private prescription: Model<Prescription>;
  private appointmentService: AppointmentService;

  constructor(db: Connection) {
    this.prescription = db.model(MODEL_NAMES.prescription);
    this.appointmentService = new AppointmentService(db);
  }

  /**
   * @param prescription document
   * @returns  Created prescription
   */
  public async create(data: Prescription): Promise<PrescriptionDocument> {
    try {
      const prescription: PrescriptionDocument =
        await this.prescription.create<Prescription>(data);
      await this.appointmentService.update(
        {
          customer: data.patient,
          date: {
            $gte: momentTZ().tz('Asia/Kolkata').startOf('day'),
            $lte: momentTZ().tz('Asia/Kolkata').endOf('day'),
          },
        },
        { isCompleted: true }
      );
      return prescription;
    } catch (error: any) {
      throw new Error(error.message || 'Error adding prescription');
    }
  }

  public async getById(id: string): Promise<PrescriptionDocument | null> {
    try {
      const prescription: PrescriptionDocument | null = await this.prescription
        .findById(id)
        .populate('products.stock')
        .populate('combinations.dilutions.stock')
        .populate('patient')
        .populate('combinations.dilutions.dilution', 'name potency')
        .populate('products.product', 'name brand images size')
        .sort('-createdAt')
        .lean();
      return prescription;
    } catch (error) {
      throw new Error('Error adding prescription');
    }
  }

  public async getByCustomerId(
    customerId: string
  ): Promise<PrescriptionDocument[]> {
    const prescriptions: PrescriptionDocument[] = await this.prescription
      .find({
        patient: customerId,
      })
      .populate('products.stock')
      .populate('combinations.dilutions.stock')
      .populate('combinations.dilutions.dilution', 'name potency')
      .populate('products.product', 'name brand images size')
      .populate('createdBy', 'firstName lastName')
      .populate('comments')
      .sort('-date')
      .lean();

    return prescriptions;
  }

  /**
   * @returns prescriptions list
   */

  public async list(
    query?: Record<string, unknown>
  ): Promise<PrescriptionDocument[]> {
    try {
      const prescriptions: PrescriptionDocument[] = await this.prescription
        .find({
          ...query,
          isDeleted: { $ne: true },
        })
        .populate('patient')
        .populate('combinations.dilutions.dilution', 'name')
        .populate('products.product', 'name')
        .sort('-createdAt');

      return prescriptions;
    } catch (error) {
      throw new Error('Error listing prescription');
    }
  }

  /**
   * @param id pre-existing prescription document objectId
   * @returns updated copy of the prescription document
   */

  public async updateById(id: string, prescription: Prescription) {
    const updatedPrescription: PrescriptionDocument | null =
      await this.prescription.findByIdAndUpdate(id, {
        $set: prescription,
      });

    return updatedPrescription;
  }

  public async delete(id: string) {
    const updatedPrescription: PrescriptionDocument | null =
      await this.prescription.findByIdAndUpdate(id, {
        $set: { isDeleted: true },
      });

    return updatedPrescription;
  }

  public async find(
    query: Record<string, unknown>
  ): Promise<PrescriptionDocument[]> {
    const result = await this.prescription.find({
      ...query,
      isDeleted: { $ne: true },
    });
    return result;
  }
}

export default PrescriptionService;
