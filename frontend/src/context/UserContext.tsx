import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../@types/UserContext";
import * as authClient from "../utils/auth-client";
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from "../configs";
import { STATUS_CODE_CONFLICT, UNAME_PASSWORD_MISSING } from "../constants";

export const defaultUser: User = {
  username: null,
};

const saveTokens = (token: string, username: string) => {
  window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, username);
};

const getTokens = () => {
  const token = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const username = window.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);

  return { token: token || "", username: username || "" };
};

const UserContext = createContext({
  user: defaultUser,
  response: "test",
  loginWithUname: (username: string, password: string) => {},
  setUser: (user: User) => {},
  signup: (username: string, password: string) => {},
  loginWithToken: () => {},
  logout: () => {},
  changeUsername: (
    username: string,
    newUsername: string,
    password: string
  ) => {},
  deleteUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: "" });
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    authClient
      .loginWithToken()
      .then((resp) => {
        setUser({ username: resp });
        setLoading(false);
      })
      .catch((err) => {
        setUser({ username: "" });
        setLoading(false);
      });
  }, []);

  const loginWithUname = (username: string, password: string) => {
    setLoading(true);
    authClient.loginWithUsername({ username, password }).then((resp) => {
      const {
        data: { username, token },
        status,
      } = resp;

      if (status === UNAME_PASSWORD_MISSING) {
        setLoading(false);
        throw new Error("Username or password is incorrect!");
      }

      if (status === UNAME_PASSWORD_MISSING) {
        setLoading(false);
        throw new Error("Username or password is missing!");
      }

      console.log(token);
      console.log(username);
      console.log(resp.data);
      saveTokens(token, username);
      setUser({ username: resp.data.username });
      setLoading(false);
    });
  };

  const signup = (username: string, password: string) => {
    authClient.signUp({ username, password }).then((response) => {
      if (response.status === STATUS_CODE_CONFLICT) {
        throw new Error("This username already exists");
      }

      if (response.status !== 200) {
        throw new Error("Something went wrong when trying to register");
      }
    });
  };

  const loginWithToken = () => {
    authClient.loginWithToken().then((resp) => {
      setUser({ username: resp });
    });
  };

  const logout = () =>
    authClient.logout().then((resp) => {
      console.log("logout");
      setUser({ username: "" });
    });

  const changeUsername = (
    username: string,
    newUsername: string,
    password: string
  ) =>
    authClient
      .changeUsername(username, newUsername, password)
      .then((newUsername) => setUser({ username: newUsername }));
  const deleteUser = () =>
    authClient.deleteUser().then((res) => setUser({ username: "" }));

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loginWithUname,
        setUser,
        signup,
        response,
        loginWithToken,
        logout,
        changeUsername,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const useAuth = () => useContext(UserContext);
const useUser = () => useAuth().user;

export { useAuth, useUser };
