import React from "react";
import Nav from "react-bootstrap/esm/Nav";
import { BsSearch } from "react-icons/bs";
import { FaExchangeAlt, FaRegAddressCard } from "react-icons/fa";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { HiHome, HiUserCircle } from "react-icons/hi";
import { LinkContainer } from "react-router-bootstrap";
import "./Sidebar.css";

function Sidebar() {
  return (
    <Nav className="col-md-1 sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <LinkContainer to="/" exact={true}>
            <li className="nav-item">
              <HiHome className="fa-icons active-icon" />
            </li>
          </LinkContainer>
          <LinkContainer to="/sell">
            <li className="nav-item">
              <FaExchangeAlt className="fa-icons" />
            </li>
          </LinkContainer>
          <LinkContainer to="/owned">
            <li className="nav-item">
              <FaRegAddressCard className="fa-icons" />
            </li>
          </LinkContainer>
          <LinkContainer to="/search">
            <li className="nav-item">
              <BsSearch className="fa-icons" />
            </li>
          </LinkContainer>
          <LinkContainer to="/play">
            <li className="nav-item">
              <GiAmericanFootballHelmet className="fa-icons" />
            </li>
          </LinkContainer>
          <LinkContainer to="/profile">
            <li className="nav-item">
              <HiUserCircle className="fa-icons" />
            </li>
          </LinkContainer>
        </ul>
      </div>
    </Nav>
  );
}

export default Sidebar;
