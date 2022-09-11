import React, { createContext, useState } from "react";
import axios from "axios";

export interface User {
  username: string | null;
  token: string | null;
}

export const defaultUser: User = {
  username: null,
  token: null,
};

interface UserContextInterface {
  user: User;
  login: (username: string, password: string) => {};
}

const UserContext = createContext({
  user: defaultUser,
  login: (username: string, password: string) => {},
  setUser: (user: User) => {},
  // signup: (username: string, password: string, url: string) => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: "", token: "" });

  const login = (username: string, password: string) => {
    // Login(username, password)
    console.log(username);
    console.log(password);
  };

  // const signup = async (
  //   username: string,
  //   password: string,
  //   url: string
  // ): Promise<any> => {
  //   const res = await axios.post(url, { username, password });
  //   console.log(res);
  //   return res;
  // };

  return (
    <UserContext.Provider value={{ user, login, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
