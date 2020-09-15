import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Login from "../components/Login/Login";
import { useAuthContext } from "../context/auth/authContext";

function LoginPage() {
  return (
    <Container>
      <Row>
        <Col className="header-column">
          <h1 className="heading">
            Cric<span>Tez</span>
          </h1>
          <p className="subheading">Crypto Cricket Fantasy League</p>
        </Col>
        <Col>
          <Login />
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
