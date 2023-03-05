/* eslint-disable new-cap */
import createDebug from 'debug';
import { Router } from 'express';
const debug = createDebug('W6:router:users');

export const usersRouter = Router();
// Tengo que acabar el router