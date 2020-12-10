import React from "react";
import { Navbar, Nav, Image } from "react-bootstrap";
import Auth from "./Auth";
import logo from "../images/D.png";
import { useHistory } from "react-router-dom";

export default function NavBar() {
  const history = useHistory();

  const goToHome = (e) => {
    e.preventDefault();
    history.push("/");
  };

  const goToApi = (e) => {
    e.preventDefault();
    history.push("/api/pokemon");
  };

  return (
    <div className="NavBar">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand style={{ fontSize: "23px", color: "lightblue" }} href="/">
          <Image
            width="70px"
            style={{ backgroundColor: "white" }}
            roundedCircle
            src={logo}
            alt="DANIEL NOFULLA"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link
              style={{ color: "lightcoral", fontSize: "20px" }}
              onClick={goToHome}
            >
              Home
            </Nav.Link>
            <Nav.Link
              style={{ color: "white", fontSize: "20px" }}
              onClick={goToApi}
            >
              Pokemon API
            </Nav.Link>
          </Nav>
          <Auth />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
