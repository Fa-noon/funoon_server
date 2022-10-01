import express from 'express';
import morgan from 'morgan';
import userRouter from './app/routes/userRoutes';
import postRouter from './app/routes/postRoutes';
import AppError from './app/helpers/appError';
import helmet from 'helmet';

const app = express();
//--------------------------Parsing the JSON------------------------
app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//--------------------------Logging in dev mode------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//--------------------------Secuirty------------------------
app.use(helmet());

//--------------------------Mounting rounters------------------------
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

//--------------------------Invalid Urls------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
