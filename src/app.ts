import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { CustomError } from './errors/error.js';
import { usersRouter } from './router/user.router.js';
// Import path from 'path';
// import { __dirname } from './config.js';

const debug = createDebug('CH5:app');
export const app = express();

app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: '*',
};

// Me da error en los tests, lo dejo comentado.

// debug(__dirname);
// app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/users', usersRouter);

app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.status(status);
    debug('error');
    debug(error.message);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
  }
);
