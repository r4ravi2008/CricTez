import React, { useState } from "react";
import { LOGOUT } from "../../context/types";
import { useAuthContext } from "../../context/auth/authContext";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./Navbar.css";
import { LinkContainer } from "react-router-bootstrap";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function MainNavbar(props) {
  const [state, dispatch] = useAuthContext();

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
          <li className="nav-item small-primary">
            <FaSignOutAlt className="fa-icons" />
          </li>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
