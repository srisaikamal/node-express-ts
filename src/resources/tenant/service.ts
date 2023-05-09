import { TenantDocument, Tenant, TenantCreateRequest } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, isValidObjectId, Model } from 'mongoose';
import { PUBLIC_MODEL_NAMES } from '@utils/constants';
import { User } from '@resources/user/interface';
import { Role } from '@resources/role/interface';
import switchToDatabase from '@utils/database/switch';
import { Store } from '@resources/store/interface';
import { Settings } from '@resources/settings/interface';

class TenantService {
  private db: Connection;
  private tenant: Model<Tenant>;
  private user: Model<User>;
  private role: Model<Role>;
  private store: Model<Store>;
  private settings: Model<Settings>;

  constructor(db: Connection) {
    this.db = db;
    this.tenant = db.model(PUBLIC_MODEL_NAMES.tenant);
    this.user = db.model(PUBLIC_MODEL_NAMES.user);
    this.role = db.model(PUBLIC_MODEL_NAMES.role);
    this.store = db.model(PUBLIC_MODEL_NAMES.store);
    this.settings = db.model(PUBLIC_MODEL_NAMES.settings);
  }

  private setDbModels = (db: Connection): void => {
    this.db = db;
    this.user = db.model(PUBLIC_MODEL_NAMES.user);
    this.role = db.model(PUBLIC_MODEL_NAMES.role);
    this.store = db.model(PUBLIC_MODEL_NAMES.store);
    this.settings = db.model(PUBLIC_MODEL_NAMES.settings);
  };

  /**
   * @param data to create new tenant
   * @returns  Created tenant
   */
  public async create(data: TenantCreateRequest): Promise<TenantDocument> {
    const {
      name,
      tenantId,
      description,
      firstUserName,
      firstUserPassword,
      firstUserUsername,
      permissions,
      store,
      logo,
      isActive,
      ownerAddress,
      ownerContact,
      ownerName,
      subscribedTill,
    } = data;

    const doesTenantExist = await this.tenant.exists({ tenantId });
    if (doesTenantExist) {
      throw new Error('Business Id already exists');
    }
    const tenant: TenantDocument = await this.tenant.create({
      name,
      tenantId,
      description,
      logo,
      isActive,
      ownerAddress,
      ownerContact,
      ownerName,
      subscribedTill,
    });

    // Switch to the new tenant
    this.db = switchToDatabase(tenantId);
    this.setDbModels(this.db);

    const roleDoc = await this.role.create({
      name: 'Doctor',
      permissions,
      description: 'Has access to Doctor level permissions',
    });
    const storeDoc = await this.store.create({
      name: store,
    });
    this.user.create({
      username: firstUserUsername,
      firstName: firstUserName,
      password: firstUserPassword,
      role: roleDoc._id,
      stores: [storeDoc._id],
    });
    this.settings.create({
      store: storeDoc._id,
      name: 'doctorsRoleId',
      value: roleDoc._id,
    });

    return tenant;
  }

  /**
   * @returns tenants list
   */

  public async list(): Promise<TenantDocument[]> {
    const tenants: TenantDocument[] = await this.tenant.find({
      tenantId: { $ne: 'public' },
      isDeleted: { $ne: true },
    });
    return tenants;
  }

  /**
   * @returns Tenant document or null if not found
   */

  public async findOne(tenantId: string): Promise<TenantDocument | null> {
    const tenant: TenantDocument | null = await this.tenant.findOne({
      ...(isValidObjectId(tenantId)
        ? { _id: tenantId }
        : {
            tenantId: { $regex: tenantId, $options: 'i' },
          }),
      isDeleted: { $ne: true },
    });
    return tenant;
  }

  /**
   * @returns deleted Tenant document
   */

  public async delete(_id: string) {
    await this.tenant.findByIdAndUpdate(_id, { isDeleted: true });
  }

  /**
   * @returns deleted Tenant document
   */

  public async patch(_id: string, value: Partial<Tenant>) {
    await this.tenant.findByIdAndUpdate(_id, { $set: value });
  }
}

export default TenantService;
