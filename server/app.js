import express from 'express';
import morgan from 'morgan';
import userRouter from './app/routes/userRoutes.js';
import postRouter from './app/routes/postRoutes.js';
import AppError from './app/helpers/appError.js';
import helmet from 'helmet';
import globalErrorHandler from  './app/controllers/errorController.js'

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

//------------------------------For testing-------------------------------------
app.use('/', (req, res) => {
  res.send('Working Fine!');
});

//--------------------------Invalid Urls------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//--------------------------Global Error Handeling------------------------
app.use(globalErrorHandler);

export default app;
