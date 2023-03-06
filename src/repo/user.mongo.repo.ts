import createDebug from 'debug';
import { User } from '../entities/user.js';
import { HTTPError } from '../errors/error.js';
import { Repo } from './repo.interface.js';
import { UserModel } from './user.mongo.model.js';
const debug = createDebug('CH5:repo:users');

export class UsersMongoRepo implements Repo<User> {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }

    return UsersMongoRepo.instance;
  }

  private constructor() {
    debug('instantiate');
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', {
        friends: 0,
        enemies: 0,
      })
      .exec();
    return data;
  }

  async queryId(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', {
        friends: 0,
        enemies: 0,
      })
      .exec();

    if (!data) throw new HTTPError(404, 'Person not found', 'Id not found');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const data = await UserModel.find({ [query.key]: query.value })
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', {
        friends: 0,
        enemies: 0,
      })
      .exec();
    return data;
  }

  async create(user: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(user);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return {} as User;
  }

  async erase(id: string): Promise<void> {
    debug('erase');
    const data = UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(404, 'Not found', 'Delete not posible: id not found');
  }
}
