import "./App.css";
import { Route, Routes } from "react-router-dom";

import UserContextProvider from "./components/UserContext";
import Register from "./components/register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Account from "./components/Account";

import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000/";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/account' element={<Account />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
