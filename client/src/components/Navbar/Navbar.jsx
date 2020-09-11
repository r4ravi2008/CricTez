import React from "react";
import { LOGOUT } from "../../context/types";
import { useAuthContext } from "../../context/auth/authContext";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./Navbar.css";
import { LinkContainer } from "react-router-bootstrap";

export default function MainNavbar(props) {
  const [state, dispatch] = useAuthContext();

  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };

  return (
    <Navbar variant="dark" expand="lg" className="navbar">
      {/* <Navbar.Brand className="navbar__header">Crypto Cricket</Navbar.Brand> */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Nav.Link href="">MarketPlace</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/sell">
            <Nav.Link href="">Sell Cards</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/owned">
            <Nav.Link href="">Owned Cards</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/play">
            <Nav.Link href="">Compete</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/addplayer">
            <Nav.Link href="">Add Player</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/minttoken">
            <Nav.Link href="">Mint Token</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/matches">
            <Nav.Link href="">Matches</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav>
          <Nav.Link>{state.userAddress}</Nav.Link>
          <LinkContainer to="/profile">
            <Nav.Link>Profile</Nav.Link>
          </LinkContainer>
          <Nav.Link onClick={logout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
