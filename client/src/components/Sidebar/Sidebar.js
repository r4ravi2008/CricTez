import React from "react";
import "./Sidebar.css";
import { HiHome } from "react-icons/hi";
import { FaExchangeAlt, FaRegAddressCard } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
import { BsSearch } from "react-icons/bs";
import { HiUserCircle } from "react-icons/hi";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/esm/Nav";

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
              <GiCricketBat className="fa-icons" />
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
