export type User = {
  name: string;
  email: string;
  password: string;
  friends: User[];
  enemies: User[];
};
