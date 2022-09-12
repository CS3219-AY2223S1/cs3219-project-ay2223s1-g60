import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { User } from "../@types/UserContext";
import * as authClient from "../utils/auth-client";
import { AsyncResource } from "async_hooks";
 
// export interface User {
//   username: string | null;
//   token: string | null;
// }

export const defaultUser: User = {
  username: null,
  token: null,
};

// interface UserContextInterface {
//   user: User;
//   login: (username: string, password: string) => {};
// }

const UserContext = createContext({
  user: defaultUser,
  response : "",
  login: (username: string, password: string) => {},
  setUser: (user: User) => {},
  signup: (username: string, password: string) => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: "", token: "" });
  const [response, setResponse] = useState<string>("");

  const login = (username: string, password: string) => {
    // Login(username, password)
    console.log(username);
    console.log(password);
  };

  const signup = async (username:string, password:string) => {
    try {
      const res = await authClient.signUp(username, password);

      console.log("res auth: " + res);
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      console.log("Error auth: " + message);

      setResponse(message);
    }
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
    <UserContext.Provider value={{ user, login, setUser, signup, response }}>
      {children}
    </UserContext.Provider>
  );
}

const useAuth = () => useContext(UserContext);
const useUser = () => useAuth().user;

export { useAuth, useUser };
