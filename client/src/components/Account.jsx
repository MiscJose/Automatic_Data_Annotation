import { UserContext } from "./UserContext";
import { useContext, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Data from "./Data";

function Account() {
  const { user, ready, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);

  async function logOut() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  if (!ready) {
    return "Loading ...";
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-slate-100">
      {/* <p>Account page for {user.name}</p> */}
      <Data />

      <div className="flex justify-end">
        <div className="p-2">
          <p className="font-bold">
            {user
              ? `Logged in as: ${user.name} (${user.email})`
              : "You Are Not Logged In"}
          </p>
        </div>

        <div className="p-2">
          {" "}
          <button className="primary" onClick={logOut}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
