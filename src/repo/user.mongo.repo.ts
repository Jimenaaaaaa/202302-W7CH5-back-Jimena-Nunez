import createDebug from 'debug';
import { User } from '../entities/user';
import { HTTPError } from '../errors/error';
import { Repo } from './repo.interface';
import { UserModel } from './users.mongo.model';
const debug = createDebug('W6:repo:users');

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
    const data = await UserModel.find().populate('users', {
      friends: 0,
      enemies: 0,
    });
    return data;
  }

  async queryId(id: string): Promise<User> {
    const data = await UserModel.findById(id).populate('users', {
      friends: 0,
      enemies: 0,
    });

    if (!data) throw new HTTPError(404, 'Person not found', 'Id not found');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const data = await UserModel.find({ [query.key]: query.value }).populate(
      'users',
      {
        friends: 0,
        enemies: 0,
      }
    );
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
