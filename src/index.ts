import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@utils/validateEnv';
import App from './app';
import controllers from '@resources/controllers';

validateEnv();
const app = new App(controllers, Number(process.env.PORT));
app.listen();
