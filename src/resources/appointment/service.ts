import { AppointmentDocument, Appointment } from './interface';
import momentTZ from 'moment-timezone';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class AppointmentService {
  private appointment: Model<Appointment>;

  constructor(db: Connection) {
    this.appointment = db.model(MODEL_NAMES.appointment);
  }

  /**
   * @param doctor user id of the doctor
   * @param customer customer id of the appointment
   * @param date date of the appointment
   * @param createdBy user id of the user who created the appointment
   * @returns  Created appointment
   */

  public async create(
    doctor: string,
    customer: string,
    date: string,
    createdBy: string
  ): Promise<AppointmentDocument> {
    const appointment: AppointmentDocument = await this.appointment.create({
      doctor,
      customer,
      createdBy,
      date,
    });
    return appointment;
  }

  /**
   * @returns appointments list
   */

  public async find(
    query?: Record<string, unknown>
  ): Promise<AppointmentDocument[]> {
    const appointments: AppointmentDocument[] = await this.appointment
      .find({
        ...query,
      })
      .populate('customer');
    return appointments;
  }

  /**
   * @param store store id of appointments
   * @returns today appointments list
   */

  public async listTodayAppointments(
    store: string
  ): Promise<AppointmentDocument[]> {
    const appointments: AppointmentDocument[] = await this.appointment
      .find({
        date: {
          $gte: momentTZ().tz('Asia/Kolkata').startOf('day'),
          $lte: momentTZ().tz('Asia/Kolkata').endOf('day'),
        },
        store,
      })
      .populate('customer');
    return appointments;
  }

  /**
   * @param doctor doctor id of appointments
   * @param store store id of appointments
   * @returns today appointments list
   */

  public async listTodayDoctorAppointments(
    doctor: string,
    store: string
  ): Promise<AppointmentDocument[]> {
    const appointments: AppointmentDocument[] = await this.appointment
      .find({
        date: {
          $gte: momentTZ().tz('Asia/Kolkata').startOf('day'),
          $lte: momentTZ().tz('Asia/Kolkata').endOf('day'),
        },
        store,
        doctor,
      })
      .populate('customer');
    return appointments;
  }

  /**
   * @returns updated appointment
   */

  public async update(
    query: Record<string, unknown>,
    update: Record<string, unknown>
  ) {
    const appointment = await this.appointment.findOneAndUpdate(
      {
        ...query,
      },
      { $set: update },
      { new: true }
    );
    return appointment;
  }
}

export default AppointmentService;
