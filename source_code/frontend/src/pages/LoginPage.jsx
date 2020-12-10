import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "../styles/LoginPage.css";
import Axios from "axios";
import { useHistory } from "react-router";
import userContext from "../services/userContext";

export default function LoginPage() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [show, setShow] = useState(false);

  const { setUserData } = useContext(userContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const userLoginInfo = {
        username: username,
        password: password,
      };

      const res = await Axios.post(
        "http://localhost:8080/login",
        userLoginInfo
      );

      setUserData({
        token: res.data.token,
        user: res.data.user,
      });

      localStorage.setItem("auth-token", res.data.token);
      history.push("/");
    } catch (error) {
      error.response.data.message && setError(error.response.data.message);
      setShow(true);
    }
  };

  return (
    <div className="LoginPage">
      {error && show ? (
        <Alert dismissible onClose={() => setShow(false)} variant="danger">
          {error}
        </Alert>
      ) : null}
      <div className="innerLoginPageDiv">
        <div className="loginPageDiv">
          <div style={{ fontSize: "35px", marginBottom: "3vh" }}>Log In</div>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="username"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={submit}>
              Log In
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
