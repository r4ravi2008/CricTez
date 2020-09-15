import { motion } from "framer-motion";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Login from "../components/Login/Login";
import { useAuthContext } from "../context/auth/authContext";

function LoginPage() {
  const variantsUp = {
    initial: { opacity: 0, y: "-100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };
  const variantsDown = {
    initial: { opacity: 0, y: "100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };
  return (
    <Container>
      <Row>
        <Col className="header-column">
          <div style={{ overflow: "hidden", height: "5rem" }}>
            <motion.h1
              initial="initial"
              animate="final"
              variants={variantsDown}
              className="heading"
            >
              Cric<span>Tez</span>
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden", height: "3.2rem" }}>
            <motion.p
              className="subheading"
              initial="initial"
              animate="final"
              variants={variantsUp}
            >
              Crypto Cricket Fantasy League
            </motion.p>
          </div>
        </Col>
        <Col>
          <Login />
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
