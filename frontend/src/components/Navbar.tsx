import React from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import {
  URL_USER_LOGOUT,
  URL_USER_DELETE_USER,
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from "../configs";
import ChangeUsernameDialog from "./modal/ChangeUsernameDialog";
import ChangePasswordDialog from "./modal/ChangePasswordDialog";

function Navbar() {
  const user = useUser();

  async function logout(): Promise<any> {
    const body = {
      username: user.username,
    };

    const resp = await axios.post(URL_USER_LOGOUT, body).catch((err) => {
      if (err.response) {
        throw new Error("Logout failed");
      } else {
        console.log(resp);
      }
    });

    window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, "");
    window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, "");
    return resp;
  }

  async function deleteUser(): Promise<any> {
    const body = {
      username: user.username,
    };

    const resp = await axios
      .delete(URL_USER_DELETE_USER, { data: body })
      .catch((err) => {
        if (err.response) {
          throw new Error("Logout failed");
        } else {
          console.log(resp);
        }
      });

    await logout();
    return resp;
  }

  function openChangeUsernameDialog(): void {
    <ChangeUsernameDialog isOpen={true}></ChangeUsernameDialog>;
  }

  function openChangePasswordDialog(): void {
    <ChangePasswordDialog isOpen={true}></ChangePasswordDialog>;
  }

  return (
    <div>
      <button>
        <a href="/">PeerPrep</a>
      </button>
      <button onClick={openChangeUsernameDialog}>Change username</button>
      <button onClick={openChangePasswordDialog}>Change password</button>
      <button onClick={deleteUser}>Delete user</button>
      <button onClick={logout}>Logout</button>
    </div> 
  );
}

export default Navbar;
