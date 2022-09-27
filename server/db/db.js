import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

function connectDb() {
  mongoose.connect(DB, {});
  const connection = mongoose.connection;
  connection.on('connected', () => {
    console.log('connection successfull');
  });
  connection.on('error', () => {
    console.log('connection failed');
  });
}

connectDb();
export default mongoose;
