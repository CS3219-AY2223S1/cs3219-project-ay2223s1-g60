import React from "react";
import { useUser } from "../context/UserContext";

function HomePage() {
  const user = useUser();

  return <div>SUCCESSFULLY LOGGED {user.username} IN</div>;
}

export default HomePage;
