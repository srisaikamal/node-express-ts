import UserModel from './schema';
import { createToken } from '@utils/token';
import { User, UserDocument, UserWithMethods } from './interface';
import SettingsService from '@resources/settings/service';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class UserService {
  private user: Model<UserWithMethods>;
  private settingsService: SettingsService;

  constructor(db: Connection) {
    this.user = db.model(MODEL_NAMES.user);
    this.settingsService = new SettingsService(db);
  }

  public async register(user: User) {
    await this.user.create(user);
  }

  public async login(
    username: string,
    password: string,
    tenant: string,
    isRememberEnabled: boolean = false
  ): Promise<{
    token: string;
    user: Partial<UserDocument & { tenant: string }> | null;
  }> {
    const user = await this.user
      .findOne({ username })
      .populate('stores')
      .populate('role');
    if (!user) {
      throw new Error('No user found with Username ' + username);
    }

    if (await user.isValidPassword(password)) {
      const { _id, firstName, lastName, username, stores, role, customer } =
        user;
      return {
        token: createToken(
          {
            _id,
            firstName,
            lastName,
            username,
            stores,
            role,
            customer,
            tenant,
          },
          isRememberEnabled
        ),
        user: {
          _id,
          firstName,
          lastName,
          username,
          stores,
          role,
          customer,
          tenant,
        },
      };
    } else {
      throw new Error('Invalid password');
    }
  }

  /**
   *
   * @param store store of the doctor to which he belongs to
   * @returns user documents of doctors
   */
  public async getDoctors(store: string): Promise<UserDocument[]> {
    try {
      const doctorRoleSettings = await this.settingsService.getByName(
        'doctorsRoleId',
        store
      );
      if (doctorRoleSettings) {
        const doctors = await this.user
          .find({
            role: doctorRoleSettings.value,
            stores: { $in: [store] },
          })
          .select('firstName');
        return doctors;
      } else {
        throw new Error('Please set doctors role in settings');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Unable to find doctors');
    }
  }

  public async list() {
    return await this.user
      .find({ isDeleted: { $ne: true } })
      .select('-password')
      .populate('stores', 'name')
      .populate('role', 'name');
  }

  public async delete(userId: string) {
    await this.user.updateOne({ _id: userId }, { $set: { isDeleted: true } });
  }
}

export default UserService;
