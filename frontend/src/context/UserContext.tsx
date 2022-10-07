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

const removeTokens = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  window.localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
};

const UserContext = createContext({
  user: defaultUser,
  loginWithUname: (username: string, password: string) => {},
  signup: (username: string, password: string) => {},
  loginWithToken: () => {},
  logout: () => {},
  changeUsername: (
    username: string,
    newUsername: string,
    password: string
  ) => {},
  changePassword: (
    username: string,
    newUsername: string,
    password: string
  ) => {},
  deleteUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loginWithToken().then();
  }, []);

  const loginWithUname = (username: string, password: string) => {
    setLoading(true);
    authClient.AuthClient.loginWithUname({ username, password })
      .then(({ data: { username, token }, status }) => {
        if (status === UNAME_PASSWORD_MISSING)
          throw new Error("Username or password is incorrect!");
        if (status === UNAME_PASSWORD_MISSING)
          throw new Error("Username or password is missing!");
        if (status === 500)
          throw new Error("Something went wrong when logging in");

        saveTokens(token, username);
        setUser({ username });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signup = (username: string, password: string) => {
    authClient.AuthClient.signUp({ username, password }).then((response) => {
      if (response.status === STATUS_CODE_CONFLICT)
        throw new Error("This username already exists");
      if (response.status !== 201)
        throw new Error("Something went wrong when trying to register");
    });
  };

  const loginWithToken = async () => {
    const { token, username } = getTokens();

    if (!token || !username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    authClient.AuthClient.loginWithToken(token, username)
      .then((resp) => {
        if (resp.status === 400) throw new Error("Your token is invalid");
        if (resp.status !== 201) throw new Error(resp.data.message);

        setUser({ username });
      })
      .catch((err) => {
        setUser({ username: "" });
        throw new Error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    setLoading(true);
    const { username, token } = getTokens();
    authClient.AuthClient.logout({ token, username })
      .then((resp) => {
        if (resp.status === UNAME_PASSWORD_MISSING)
          throw new Error("Username or password is missing!");
        // if (resp.status === ) throw new Error("Username or password is incorrect!");

        setUser({ username: "" });
        removeTokens();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const changeUsername = (
    username: string,
    newUsername: string,
    password: string
  ) => {
    authClient.AuthClient.changeUsername({
      username,
      newUsername,
      password,
    }).then((resp) => {
      if (resp.status !== 200)
        throw new Error("Something went wrong when updating username");

      const { token } = getTokens();
      saveTokens(token, newUsername);
      setUser({ username: newUsername });
    });
  };

  const changePassword = (
    username: string,
    oldPassword: string,
    newPassword: string
  ) => {
    authClient.AuthClient.changePassword({
      username,
      oldPassword,
      newPassword,
    }).then((resp) => {
      console.log(resp);
      if (resp.status !== 200) throw new Error(resp.data.message);
    });
  };

  const deleteUser = () => {
    setLoading(true);
    const { username } = getTokens();
    authClient.AuthClient.deleteUser({ username })
      .then((resp) => {
        if (resp.status !== 200)
          throw new Error("Something went wrong when deleting the account!");

        removeTokens();
        setUser({ username: "" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        signup,
        loginWithUname,
        loginWithToken,
        logout,
        changeUsername,
        changePassword,
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
