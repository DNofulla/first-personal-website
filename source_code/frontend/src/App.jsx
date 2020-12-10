import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/App.css";
import Axios from "axios";
import userContext from "./services/userContext";
import LandingPage from "./pages/LandingPage";
import ApiPage from "./pages/ApiPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const validateJWTToken = async () => {
      let jwtToken = localStorage.getItem("auth-token");
      if (jwtToken === null) {
        jwtToken = "";
        localStorage.setItem("auth-token", "");
      }

      const res = await Axios.post("http://localhost:8080/validToken", null, {
        headers: {
          "x-auth-token": jwtToken,
        },
      });
      if (res.data) {
        const response = await Axios.get("http://localhost:8080/user", {
          headers: {
            "x-auth-token": jwtToken,
          },
        });
        setUserData({
          jwtToken,
          user: response.data,
        });
        console.log(userData);
      }
    };
    validateJWTToken();
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100vh", backgroundColor: "#00587a" }}
      className="App"
    >
      <Router>
        <userContext.Provider value={{ userData, setUserData }}>
          <NavBar />
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/profile/view/:profileId" exact component={HomePage} />
            <Route path="/login" exact component={LoginPage} />
            <Route path="/profile/edit" exact component={ProfilePage} />
            <Route path="/api/pokemon" exact component={ApiPage} />
            <Route path="/register" exact component={RegisterPage} />
          </Switch>
        </userContext.Provider>
      </Router>
    </div>
  );
}
