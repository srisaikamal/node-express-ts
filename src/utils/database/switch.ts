import mongoose, { Connection } from 'mongoose';
import { PUBLIC_SCHEMAS, TENANT_SCHEMAS } from './schemas';

const switchToDatabase = (name: string) => {
  const db = mongoose.connection.useDb(name, {
    useCache: true,
    noListener: true,
  });
  if (!Object.keys(db.models).length) {
    (name === 'public' ? PUBLIC_SCHEMAS : TENANT_SCHEMAS).forEach(
      (schema, modelName) => {
        db.model(modelName, schema, modelName);
      }
    );
  }
  return db;
};

export default switchToDatabase;
