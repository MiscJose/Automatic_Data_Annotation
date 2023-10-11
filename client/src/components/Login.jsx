import { useContext, useState } from "react";
import axios from "axios";
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://localhost:3000/";

import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  // grabbing ability to change userInfo
  const { setUser } = useContext(UserContext);

  const handleEmail = (evt) => {
    return setEmail(evt.target.value);
  };
  const handlePassword = (evt) => {
    return setPassword(evt.target.value);
  };

  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: "/login",
        data: {
          email,
          password,
        },
      });

      setUser(response.data);
      alert("Login Successful");
      setRedirect(true);
    } catch (e) {
      alert("Login Failed! ");
    }
  }

  if (redirect) {
    return <Navigate to={"/account"} />;
  }

  return (
    <div>
      <h1>Login Page!</h1>
      <form action="" onSubmit={handleLogin}>
        <input
          onChange={handleEmail}
          type="email"
          placeholder="email"
          value={email}
          id="email"
        />
        <input
          onChange={handlePassword}
          type="password"
          placeholder="password"
          value={password}
          id="password"
        />
        <button>Login</button>
      </form>
      <button>
        <Link to={"/register"}>Go to Register</Link>
      </button>
    </div>
  );
}

export default Login;
