import { createContext } from "react";
import { useState, useEffect } from "react";
export const UserContext = createContext({});

import axios from "axios";
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://localhost:3000/";

function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios({
        method: "get",
        url: "/profile",
      }).then(({ data }) => {
        setUser(data);
        setReady(true);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
