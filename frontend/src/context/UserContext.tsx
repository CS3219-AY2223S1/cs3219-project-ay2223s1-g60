import React, { createContext, useState, useContext } from "react";
import { User } from "../@types/UserContext";
import * as authClient from "../utils/auth-client";
 
export const defaultUser: User = {
  username: null,
};

const UserContext = createContext({
  user: defaultUser,
  response : "test",
  loginWithUname: (username: string, password: string) => {},
  setUser: (user: User) => {},
  signup: (username: string, password: string) => {},
  loginWithToken: () => {},
  logout: () => {},
  changeUsername:(username:string, newUsername:string, password:string) => {},
  deleteUser:() => {}
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: "" });
  const [response, setResponse] = useState<string>("");

  const loginWithUname = (username: string, password: string) => authClient.loginWithUsername(username, password).then((resp) => setUser({username : resp}));
  const signup = (username:string, password:string) => authClient.signUp(username, password);
  const loginWithToken = () => authClient.loginWithToken().then((resp) => setUser({username : resp}));
  const logout = () => authClient.logout().then((resp) => setUser({username : ""}));
  const changeUsername = (username:string, newUsername:string, password:string) => authClient.changeUsername(username, newUsername, password).then((newUsername) => setUser({username : newUsername}));
  const deleteUser = () => authClient.deleteUser().then((res) => setUser({username : ""}));

  return (
    <UserContext.Provider value={{ user, loginWithUname, setUser, signup, response, loginWithToken, logout, changeUsername, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

const useAuth = () => useContext(UserContext);
const useUser = () => useAuth().user;

export { useAuth, useUser };
