import { User } from '../entities/user';
import { UserModel } from './user.mongo.model';
import { UsersMongoRepo } from './user.mongo.repo';

const repo = UsersMongoRepo.getInstance();

jest.mock('./user.mongo.model');

let value: unknown;

const mockPopulateExec = () => ({
  populate: jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(value),
    })),
  })),
});

const mockExec = () => ({
  exec: jest.fn().mockResolvedValue(value),
});

const mockUsers = [
  {
    id: '123',
    name: 'test',
    email: 'test',
    password: 'test',
    friends: [{}],
    enemies: [{}],
  },
  {
    id: '111',
    name: 'test',
    email: 'test',
    password: 'test',
    friends: [{}],
    enemies: [{}],
  },
];

const mockPopulateFunction = (mockPopulateValue: unknown) => ({
  populate: jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockPopulateValue),
    })),
  })),
});

describe('Given UserMongoRepo', () => {
  test('Then it should be able to be instanced', () => {
    expect(repo).toBeInstanceOf(UsersMongoRepo);
  });

  describe('When call the Query method', () => {
    test('Then it should return the members array', async () => {
      value = [{}];
      (UserModel.find as jest.Mock).mockImplementation(mockPopulateExec);
      const result = await repo.query();
      expect(result).toEqual([{}]);
    });
  });

  describe('When call the queryId method', () => {
    describe('When the id returns a user', () => {
      test('Then it should return the user', async () => {
        value = {};
        (UserModel.findById as jest.Mock).mockImplementation(mockPopulateExec);
        const result = await repo.queryId('1');
        expect(result).toEqual({});
      });
    });
    describe('When the id not returns a user', () => {
      test('Then it should throw error', async () => {
        value = undefined;
        (UserModel.findById as jest.Mock).mockImplementation(mockPopulateExec);
        const result = repo.queryId('1');
        await expect(result).rejects.toThrow();
      });
    });
  });

  describe('When call the create method', () => {
    test('Then it should return the created member', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({});
      const result = await repo.create({});
      expect(result).toEqual({});
    });
  });

  describe('When the update method is used', () => {
    beforeEach(async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ id: '2' });
    });

    test('Then if the findByIdAndUpdate method resolve value to undefined, it should throw an Error', async () => {
      const mockUser = {
        id: '2',
        name: 'test',
      } as Partial<User>;
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });
  });
  describe('When the create method is called', () => {
    test('Then it should create a new User', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ name: 'test' });

      const result = await repo.create({ name: 'test' });
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('When the update method called', () => {
    beforeEach(async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '2',
      });
    });

    test('Then if the findByIdAndUpdate method resolve value to undefined, it should throw an Error', async () => {
      const mockUser = {
        id: '2',
        name: 'test',
      } as Partial<User>;
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    beforeEach(async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      await repo.erase('1');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
