export interface User {
    username: string | null;
    token: string | null;
}
  
export interface UserContextInterface {
    user: User;
    login: (username: string, password: string) => {};
}