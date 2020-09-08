import React from "react";
import "./Sidebar.css";
import { HiHome } from "react-icons/hi";
import { FaExchangeAlt } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
import { BsSearch } from "react-icons/bs";
import { HiUserCircle } from "react-icons/hi";
import { LinkContainer } from "react-router-bootstrap";

function Sidebar() {
  return (
    <nav className="col-md-1 sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item active">
            <LinkContainer to="/">
              <HiHome className="fa-icons" />
            </LinkContainer>
          </li>
          <li className="nav-item">
            <LinkContainer to="/sell">
              <FaExchangeAlt className="fa-icons" />
            </LinkContainer>
          </li>
          <li className="nav-item">
            <LinkContainer to="/search">
              <BsSearch className="fa-icons" />
            </LinkContainer>
          </li>
          <li className="nav-item">
            <LinkContainer to="/play">
              <GiCricketBat className="fa-icons" />
            </LinkContainer>
          </li>
          <li className="nav-item">
            <LinkContainer to="/profile">
              <HiUserCircle className="fa-icons" />
            </LinkContainer>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
