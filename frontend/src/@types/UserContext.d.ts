export interface User {
  username: string | null;
}

export interface UserContextInterface {
  user: User;
  login: (username: string, password: string) => {};
}

export interface Response<T> {
  status: number;
  statusText: string;
  data: T;
}
