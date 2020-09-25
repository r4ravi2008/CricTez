import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/esm/Nav";
import { BsSearch } from "react-icons/bs";
import { FaExchangeAlt, FaRegAddressCard, FaUserPlus } from "react-icons/fa";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { HiHome, HiUserCircle } from "react-icons/hi";
import { MdAddCircle, MdAddToPhotos } from "react-icons/md";
import { LinkContainer } from "react-router-bootstrap";
import { useAuthContext } from "../../context/auth/authContext";
import "./Sidebar.css";
import jwt_decode from "jwt-decode";

function Sidebar() {
  const [admin, setAdmin] = useState(false);
  const [state, dispatch] = useAuthContext();

  useEffect(() => {
    var decoded = jwt_decode(state.token);
    setAdmin(decoded.admin);
  }, [state.token]);

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
          {admin ? (
            <>
              <LinkContainer to="/addplayer">
                <li className="nav-item">
                  <FaUserPlus className="fa-icons" />
                </li>
              </LinkContainer>
              <LinkContainer to="/minttoken">
                <li className="nav-item">
                  <MdAddToPhotos className="fa-icons" />
                </li>
              </LinkContainer>
              <LinkContainer to="/matches">
                <li className="nav-item">
                  <MdAddCircle className="fa-icons" />
                </li>
              </LinkContainer>{" "}
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </Nav>
  );
}

export default Sidebar;
