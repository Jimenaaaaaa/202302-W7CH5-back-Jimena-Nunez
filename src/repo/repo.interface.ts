export interface Repo<T> {
  query(): Promise<T[]>;
  queryId(_id: string): Promise<T>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(data: T): Promise<T>;
  erase(id: string): Promise<void>;
}
