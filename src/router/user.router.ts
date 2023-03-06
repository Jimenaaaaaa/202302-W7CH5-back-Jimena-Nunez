/* eslint-disable new-cap */
import createDebug from 'debug';
import { Router } from 'express';
import { UsersController } from '../controller/user.controller.js';
import { Interceptors } from '../interceptors/interceptor.js';
import { UsersMongoRepo } from '../repo/user.mongo.repo.js';
const debug = createDebug('W6:router');

export const usersRouter = Router();

const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

usersRouter.get('/', controller.getAll.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch(
  '/add-friend',
  Interceptors.logged,
  controller.addFriend.bind(controller)
);
usersRouter.patch(
  '/add-enemy',
  Interceptors.logged,
  controller.addEnemy.bind(controller)
);
usersRouter.patch(
  '/remove-friend',
  Interceptors.logged,
  controller.removeFriend.bind(controller)
);
usersRouter.patch(
  '/remove-enemy',
  Interceptors.logged,
  controller.removeEnemy.bind(controller)
);

usersRouter.patch(
  '/edit-profile',
  Interceptors.logged,
  Interceptors.authorized,
  controller.editProfile.bind(controller)
);

usersRouter.patch(
  '/delete-user',
  Interceptors.logged,
  Interceptors.authorized,
  controller.deleteUser.bind(controller)
);
