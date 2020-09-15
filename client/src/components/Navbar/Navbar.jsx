import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useAuthContext } from "../../context/auth/authContext";
import { LOGOUT } from "../../context/types";
import "./Navbar.css";

export default function MainNavbar() {
  const [, dispatch] = useAuthContext();

  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };

  return (
    <Navbar variant="dark" expand="lg" className="navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Brand className="navbar__header">
          Cric<span>Tez</span>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <li className="nav-item small-primary">
            <FaBell className="fa-icons" />
          </li>
          <li className="nav-item small-primary" onClick={logout}>
            <LinkContainer to="/">
              <FaSignOutAlt className="fa-icons" />
            </LinkContainer>
          </li>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
