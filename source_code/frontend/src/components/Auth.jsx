import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import userContext from "../services/userContext";

export default function Auth() {
  const { userData, setUserData } = useContext(userContext);
  const history = useHistory();

  const login = () => {
    history.push("/login");
  };

  const signup = () => {
    history.push("/register");
  };

  const profile = (e) => {
    e.preventDefault();
    history.push("/profile/edit");
  };

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/");
  };

  return (
    <Nav>
      {userData.user ? (
        <>
          <Nav.Link
            style={{
              color: "lightcoral",
              margin: "auto",
              fontSize: "20px",
            }}
            onClick={profile}
          >
            My Profile
          </Nav.Link>
          <Nav.Link eventKey={2} onClick={logout}>
            <Button>Log Out</Button>
          </Nav.Link>
        </>
      ) : (
        <>
          <Nav.Link eventKey={2} onClick={login}>
            <Button>Log In</Button>
          </Nav.Link>
          <Nav.Link eventKey={2} onClick={signup}>
            <Button>Sign Up</Button>
          </Nav.Link>
        </>
      )}
    </Nav>
  );
}
