import mongoose from 'mongoose';

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

const connect = (mongoUri: string) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoUri, mongoOptions)
      .then((connection) => {
        console.log('Mongodb connection successful!');
        resolve(connection);
      })
      .catch((error) => reject(error));
  });
};

export default connect;
