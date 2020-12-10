import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "../styles/LoginPage.css";
import Axios from "axios";
import { useHistory } from "react-router";
import "../styles/RegisterPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [show, setShow] = useState(false);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const userRegisterInfo = {
        username: username,
        password: password,
      };

      const res = await Axios.post(
        "http://localhost:8080/register",
        userRegisterInfo
      );

      history.push("/login");
    } catch (error) {
      error.response.data.message && setError(error.response.data.message);
      setShow(true);
    }
  };

  return (
    <div className="RegisterPage">
      {error && show ? (
        <Alert dismissible onClose={() => setShow(false)} variant="danger">
          {error}
        </Alert>
      ) : null}
      <div className="innerRegisterPageDiv">
        <div className="registerPageDiv">
          <div style={{ fontSize: "35px", marginBottom: "3vh" }}>
            Register Account
          </div>
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
              Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
