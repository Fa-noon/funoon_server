import express, { json } from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();

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
