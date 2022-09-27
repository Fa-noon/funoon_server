import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

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
app.use('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
