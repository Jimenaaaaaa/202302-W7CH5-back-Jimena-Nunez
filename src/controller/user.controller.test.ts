import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user';
import { Auth, PayloadToken } from '../services/auth';
import { Repo } from '../repo/repo.interface';
import { UsersController } from './user.controller';
import { RequestPlus } from '../interceptors/interceptor';

jest.mock('../services/auth');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Given the register method from UserController class', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);

  describe('When there is not a password in the body', () => {
    const req = {
      body: {
        email: 'test',
      },
    } as Request;

    const resp = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    test('Then Next should have been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When there is not a email in the body', () => {
    const req = {
      body: {
        password: 'test',
      },
    } as Request;

    const resp = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    test('Then Next should have been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When all is OK', () => {
    const req = {
      body: {
        email: 'prueba',
        password: 'prueba',
      },
    } as Request;

    const resp = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    test('Then json should have been called', async () => {
      await controller.register(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});

describe('Given the login method from UserController class', () => {
  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);

  const req = {
    body: {
      email: 'test',
      password: 'test',
    },
  } as Request;

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;
  Auth.compare = jest.fn().mockResolvedValue(true);

  describe('The password and the email are valid', () => {
    (mockRepo.search as jest.Mock).mockResolvedValue(['test']);

    test('expect jsonn to have been called', async () => {
      await controller.login(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('If the user gives no password', () => {
    const req2 = {
      body: {
        email: 'test',
      },
    } as Request;

    test('expect next to have been called ', async () => {
      await controller.login(req2, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});

describe('Given  call the addFriend method', () => {
  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);

  describe('When all params are correct', () => {
    const req1 = {
      body: {
        id: '2',
        name: 'test',
        email: 'test',
        password: '111',
      },
      info: {
        id: '111',
      },
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;

    test('Then it should call res.json', async () => {
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        friends: ['test'],
      });
      (mockRepo.update as jest.Mock).mockResolvedValue({
        friends: 'test',
      });

      await controller.addFriend(req1, resp1, next1);
      expect(resp1.json).toHaveBeenCalled();
    });
  });

  describe('When no req.info.id', () => {
    const req1 = {
      body: {
        name: 'test',
        email: 'test',
      },
      info: {
        id: '111',
      },
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;

    test('Then it should call next', async () => {
      req1.info = { name: 'Test' } as unknown as PayloadToken;
      await controller.addFriend(req1, resp1, next1);
      expect(next1).toHaveBeenCalled();
    });
  });
});

describe('Given the addEnemy method', () => {
  // describe('When all params are correct', () => {
  //   const req1 = {
  //     body: {
  //       id: '2',
  //     },
  //     info: {
  //       id: '111',
  //     },
  //   } as unknown as RequestPlus;

  //   const resp1 = {
  //     status: jest.fn(),
  //     json: jest.fn(),
  //   } as unknown as Response;

  //   const next1 = jest.fn() as NextFunction;

  //   test('Then it should call res.json', async () => {
  //     (mockRepo.queryId as jest.Mock).mockResolvedValueOnce({
  //       enemies: ['test2'],
  //     });
  //     (mockRepo.update as jest.Mock).mockResolvedValueOnce({
  //       enemies: 'test2',
  //     });
  //     await controller.addEnemy(req1, resp1, next1);
  //     expect(resp1.json).toHaveBeenCalled();
  //   });
  // });

  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);

  describe('When no req.member.id', () => {
    const req1 = {
      body: {},
      info: {},
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;
    test('Then it should call next', async () => {
      req1.info = { name: 'Test' } as unknown as PayloadToken;
      await controller.addEnemy(req1, resp1, next1);
      expect(next1).toHaveBeenCalled();
    });
  });
});

describe('Given the removeFriend method', () => {
  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);
  describe('When all params are correct', () => {
    const req1 = {
      body: {
        id: '2',
        name: 'test',
        email: 'test',
        password: '111',
      },
      info: {
        id: '111',
      },
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;

    test('Then it should call res.json', async () => {
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        friends: [{ id: 'test' }, { id: 'test3' }],
      });

      (mockRepo.update as jest.Mock).mockResolvedValue({
        friends: 'test2',
      });
      await controller.removeFriend(req1, resp1, next1);
      expect(resp1.json).toHaveBeenCalled();
    });
  });

  describe('When no req.member.id', () => {
    const req1 = {
      body: {},
      info: {},
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;
    test('Then it should call next', async () => {
      req1.info = { name: 'Test' } as unknown as PayloadToken;
      await controller.removeFriend(req1, resp1, next1);
      expect(next1).toHaveBeenCalled();
    });
  });
});

describe('When call the removeEnemy method', () => {
  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);
  describe('When all params are correct', () => {
    const req1 = {
      body: {
        id: '2',
        name: 'test',
        email: 'test',
        password: '111',
      },
      info: {
        id: '111',
      },
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;

    test('Then it should call res.json', async () => {
      (mockRepo.queryId as jest.Mock).mockResolvedValueOnce({
        enemies: ['test'],
      });
      (mockRepo.queryId as jest.Mock).mockResolvedValueOnce({
        enemies: ['test2'],
      });
      (mockRepo.update as jest.Mock).mockResolvedValueOnce({
        enemies: 'test2',
      });
      (mockRepo.update as jest.Mock).mockResolvedValueOnce({
        enemies: 'test2',
      });
      await controller.removeEnemy(req1, resp1, next1);
      expect(resp1.json).toHaveBeenCalled();
    });
  });

  describe('When no req.member.id', () => {
    const req1 = {
      body: {},
      info: {},
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;
    test('Then it should call next', async () => {
      req1.info = { name: 'Test' } as unknown as PayloadToken;
      await controller.removeEnemy(req1, resp1, next1);
      expect(next1).toHaveBeenCalled();
    });
  });
});

describe('Given the editProfile method', () => {
  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);

  describe('When all params are correct', () => {
    const req1 = {
      body: {
        id: '2',
        name: 'test',
        email: 'test',
        password: '111',
      },
      info: {
        id: '111',
      },
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;

    test('Then it should call resp.json', async () => {
      (mockRepo.queryId as jest.Mock).mockResolvedValue({});
      (mockRepo.update as jest.Mock).mockResolvedValue({});
      await controller.editProfile(req1, resp1, next1);
      expect(resp1.json).toHaveBeenCalled();
    });
  });

  describe('When repo.queryById fails', () => {
    const req1 = {
      body: {},
      info: {},
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;

    test('Then it should call next', async () => {
      (mockRepo.queryId as jest.Mock).mockResolvedValue(undefined);

      await controller.editProfile(req1, resp1, next1);
      expect(next1).toHaveBeenCalled();
    });
    test('When there is no req.member.id then it should call next', async () => {
      req1.info = { name: 'Test' } as unknown as PayloadToken;
      await controller.editProfile(req1, resp1, next1);
      expect(next1).toHaveBeenCalled();
    });
  });
});

describe('Given the the deleteMember method', () => {
  const mockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);
  describe('When all params are correct', () => {
    const req1 = {
      body: {
        id: '2',
        name: 'test',
        email: 'test',
        password: '111',
      },
      info: {
        id: '111',
      },
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;

    test('Then it should call resp.json', async () => {
      req1.info = { id: 'Test' } as unknown as PayloadToken;

      (mockRepo.erase as jest.Mock).mockResolvedValue('');
      await controller.deleteUser(req1, resp1, next1);

      expect(mockRepo.erase).toHaveBeenCalled();
    });
  });

  describe('When there is no req.member.id', () => {
    const req1 = {
      body: {},
      info: {},
    } as unknown as RequestPlus;

    const resp1 = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const next1 = jest.fn() as NextFunction;
    test('Then it should call next', async () => {
      req1.info = { name: 'Test' } as unknown as PayloadToken;
      await controller.deleteUser(req1, resp1, next1);
      expect(next1).toHaveBeenCalled();
    });
  });
});
