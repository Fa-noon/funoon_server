import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

//---------------------------Connect Databse------------------------
dotenv.config({ path: __dirname + './../config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'));

const PORT = process.env.PORT;

//---------------------------Import configuration of App------------------------
const app = require('./app');

app.listen(PORT, () => console.log(`Server live at port:${PORT}`));
