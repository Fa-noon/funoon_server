import express from 'express';
import morgan from 'morgan';
import userRouter from './app/routes/userRoutes';
import AppError from './app/helpers/appError';
import * as dotenv from 'dotenv';

const app = express();
//--------------------------Parsing the JSON------------------------
app.use(
  express.json({
    limit: '10kb',
  })
);
//--------------------------Logging in dev mode------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//--------------------------Mounting rounters------------------------
app.use('/api/v1/users', userRouter);

//--------------------------Invalid Urls------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
