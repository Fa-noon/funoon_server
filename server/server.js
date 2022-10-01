import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//---------------------------Connect Databse------------------------
dotenv.config({ path: __dirname + './../config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'));

const PORT = process.env.PORT;

//---------------------------Import configuration of App------------------------
import app from './app.js';

app.listen(PORT, () => console.log(`Server live at port:${PORT}`));
