import express, { Application } from 'express';
import connect from './utils/database/connect';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@utils/interfaces/controller';
import ErrorMiddleware from '@middlewares/error';
import helmet from 'helmet';
import http from 'http';
import expressFileUpload from 'express-fileupload';
import connectToTenantDb from '@utils/database/connectToTenant';
import SocketConnection from '@utils/socket';

class App {
  public express: Application;
  public port: number;
  public server: http.Server;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.server = http.createServer(this.express);

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initializeSockets(this.server);
  }

  private initializeMiddleware(): void {
    /**
     * Helmet helps you secure your Express apps by setting various HTTP headers.
     */
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(expressFileUpload());

    /**
     * decreases the downloadable amount of data that’s served to users.
     * Through the use of this compression, we can improve the performance
     * of our Node.js applications as our payload size is reduced drastically.
     */
    this.express.use(compression());
    /**
     * this middleware helps in carrying tenant db connection as part of request
     */
    this.express.use(connectToTenantDb);
  }

  /**
   * @param controllers list of controllers
   */
  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private initializeDatabaseConnection(): void {
    const { MONGO_URI } = process.env;
    if (typeof MONGO_URI === 'string' && !!MONGO_URI) {
      connect(MONGO_URI);
    } else {
      console.log('Please set MONGO_URI env variable');
    }
  }

  /**
   * @param server http server to connect to
   */
  private initializeSockets(server: http.Server): void {
    new SocketConnection(server);
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log('App started on port:', this.port);
    });
  }
}

export default App;
