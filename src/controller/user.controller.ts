import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repo/repo.interface.js';
import { HTTPError } from '../errors/error.js';
import { Auth, PayloadToken } from '../services/auth.js';
import { RequestPlus } from '../interceptors/interceptor';
import fs from 'fs/promises';

const debug = createDebug('CH5:controller');
export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.password = await Auth.hash(req.body.password);
      req.body.things = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Adding friend...');
      if (!req.info?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');

      const loggedUser = await this.repo.queryId(req.info?.id);
      const newFriend = await this.repo.queryId(req.body.id);

      loggedUser.friends.push(newFriend);
      newFriend.friends.push(loggedUser);

      const infoUpdated = await this.repo.update(loggedUser);

      await this.repo.update(newFriend);
      debug('Friend added');
      res.json({ results: [infoUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async addEnemy(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Adding enemy...');

      if (!req.info?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');

      const loggedUser = await this.repo.queryId(req.info?.id);
      const newEnemy = await this.repo.queryId(req.body.id);
      loggedUser.enemies.push(newEnemy);
      newEnemy.enemies.push(loggedUser);
      const infoUpdated = await this.repo.update(loggedUser);
      this.repo.update(newEnemy);
      debug('Enemy added');
      res.json({ results: [infoUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Removing friend...');

      if (!req.info?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');

      const loggedUser = await this.repo.queryId(req.info?.id);
      const newFriend = await this.repo.queryId(req.body.id);
      loggedUser.friends = loggedUser.friends.filter(
        (item) => item.id !== newFriend.id
      );
      newFriend.friends = newFriend.friends.filter(
        (item) => item.id !== loggedUser.id
      );
      const infoUpdated = await this.repo.update(loggedUser);
      this.repo.update(newFriend);
      debug('Friend removed');
      res.json({ results: [infoUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async removeEnemy(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Removing enemy');

      if (!req.info?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const loggedinfoId = req.info?.id;
      const infoToAddId = req.body.id;
      const loggedinfo = await this.repo.queryId(loggedinfoId);
      const infoToRemove = await this.repo.queryId(infoToAddId);
      loggedinfo.enemies = loggedinfo.enemies.filter(
        (item) => item.id !== infoToRemove.id
      );
      infoToRemove.enemies = infoToRemove.enemies.filter(
        (item) => item.id !== loggedinfo.id
      );
      const updatedinfo = await this.repo.update(loggedinfo);
      this.repo.update(infoToRemove);
      debug('Enemy deleted');

      res.json({ results: [updatedinfo] });
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Updating profile...');
      if (!req.info?.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const info = await this.repo.queryId(req.info.id);
      req.body.id = info.id;
      const updatedinfo = await this.repo.update(req.body);
      debug('Profile updated!');
      res.json({ results: [updatedinfo] });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Deleting info...');
      if (!req.info?.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      await this.repo.erase(req.info.id);
      debug("User deleted ='(");
    } catch (error) {
      next(error);
    }
  }
}
