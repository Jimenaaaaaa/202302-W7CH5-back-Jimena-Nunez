import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

const debug = createDebug('W6:app');
export const app = express();

app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: '*',
};

debug(__dirname);
app.use(express.static(path.resolve(__dirname, 'public')));

// Seguir aqui con los routers
app.use('/users', usersRouter);
