import React, {useState} from "react";
import { useUser, useAuth } from "../context/UserContext";
import axios from "axios";
import {
  URL_USER_LOGOUT,
  URL_USER_DELETE_USER,
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from "../configs";
import ChangeUsernameDialog from "./modal/ChangeUsernameDialog";
import ChangePasswordDialog from "./modal/ChangePasswordDialog";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const authClient = useAuth();
  const user = useUser();
  const navigate = useNavigate();

  const [usernameModalIsOpen, setUsernameModalIsOpen] = useState<boolean>(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState<boolean>(false);

  const toggleOpenUsernameModal = () => {
    setUsernameModalIsOpen(!usernameModalIsOpen);
  }
  
  const toggleOpenPasswordModal = () => {
    setPasswordModalIsOpen(!passwordModalIsOpen);
  }

  const handleLogout = async () => {
    try {
      await authClient.logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteUser = async () => {
    try {
      await authClient.deleteUser();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <button>
        <a href="/">PeerPrep</a>
      </button>
      {usernameModalIsOpen && <ChangeUsernameDialog isOpen={usernameModalIsOpen}/>}
      {passwordModalIsOpen && <ChangePasswordDialog isOpen={passwordModalIsOpen}/>}
      <button onClick={toggleOpenUsernameModal}>Change username</button>
      <button onClick={toggleOpenPasswordModal}>Change password</button>
      <button onClick={handleDeleteUser}>Delete user</button>
      <button onClick={handleLogout}>Logout</button>
    </div> 
  );
}

export default Navbar;
