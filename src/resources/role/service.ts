import { RoleDocument, Role } from './interface';
import { MongooseDefaultFields } from '@utils/interfaces/mongoose';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class RoleService {
  private role: Model<Role>;

  constructor(db: Connection) {
    this.role = db.model(MODEL_NAMES.role);
  }

  /**
   * @param name of the role
   * @param description of the role
   * @returns  Created role
   */
  public async create(
    name: string,
    permissions: string[],
    description?: string
  ): Promise<RoleDocument> {
    const role: RoleDocument = await this.role.create({
      name,
      description,
      permissions,
    });
    return role;
  }

  /**
   * @returns roles list
   */

  public async list(query?: Record<string, any>): Promise<RoleDocument[]> {
    const roles: RoleDocument[] = await this.role.find({
      ...query,
    });
    return roles;
  }

  public async delete(roleId: string) {
    await this.role.updateOne(
      {
        _id: roleId,
      },
      { $set: { isDeleted: true } }
    );
  }
}

export default RoleService;
