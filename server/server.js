import express, { json } from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from 'routes';

const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', routes);

app.use(logger('dev'));

dotenv.config({ path: __dirname + './../config.env' });
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// console.log(DB);
mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'));

app.use(json());

const PORT = process.env.PORT || 8000;

app.get('/', async (req, res) => {
  res.json({ status: true, message: 'Our node.js app works' });
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
