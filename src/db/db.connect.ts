import mongoose from 'mongoose';
import { config } from '../config.js';
const { cluster, user, password, dbName } = config;

import createDebug from 'debug';
const debug = createDebug('W6:dbConnect');

export const dbConnect = () => {
  debug('enter function');
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  console.log(uri);
  return mongoose.connect(uri);
};
