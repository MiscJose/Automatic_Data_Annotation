import { useState } from "react";
import axios from "axios";
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://localhost:3000/";

import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [redirect, setRedirect] = useState(null)


  const handleName = (evt) => {
    return setName(evt.target.value);
  };
  const handleEmail = (evt) => {
    return setEmail(evt.target.value);
  };
  const handlePassword = (evt) => {
    return setPassword(evt.target.value);
  };

  async function handleRegistration(ev) {
    // so page doesn't refresh
    ev.preventDefault();
    try {
      await axios({
        method: "post",
        url: "/register",
        data: {
          name,
          email,
          password,
        },
      });
      alert('Registration Successful. You can Login Now.')
      // setRedirect(true)
    } catch (e) {
      alert("Registration Failed! ");
    }
  }

  // if (redirect) {
  //   return <Navigate to={"/account"} />;
  // }

  return (
    <div>
      <h1>Register Page!</h1>
      <form action="" onSubmit={handleRegistration}>
        <input
          onChange={handleName}
          type="text"
          placeholder="name"
          value={name}
          id="name"
        />
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
        <button>Register</button>
      </form>
      <button>
        <Link to={"/login"}>Go to Login</Link>
      </button>
    </div>
  );
}

export default Register;
