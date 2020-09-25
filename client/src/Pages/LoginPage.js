import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import tawkTo from "tawkto-react";
import Login from "../components/Login/Login";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import StepsSvg from "../components/StepsSVG/StepsSvg";
import { tawkToPropertyId } from "../constants/tawkTo";
import "./styles.css";

function LoginPage() {
  useEffect(() => {
    tawkTo(tawkToPropertyId);
  }, []);

  const variantsUp = {
    initial: { opacity: 0, y: "-100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };

  const variantsDown = {
    initial: { opacity: 0, y: "100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };
  return (
    <Container fluid style={{ padding: 0, overflow: "hidden" }}>
      <Navbar
        variant="dark"
        expand="lg"
        className="navbar"
        style={{ position: "fixed", width: "100%" }}
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Brand className="navbar__header">
            Cric<span>Tez</span>
          </Navbar.Brand>
          <Nav className="ml-auto">
            <li
              className="nav-item page-links"
              onClick={() => window.scrollTo(0, 500)}
            >
              Get Started
            </li>
            <li
              className="nav-item page-links"
              onClick={() => window.scrollTo(0, 1400)}
            >
              How does it work?
            </li>
            <li
              className="nav-item page-links"
              onClick={() => window.scrollTo(0, 500)}
            >
              Rules
            </li>
            <li
              className="nav-item small-primary"
              onClick={() =>
                window.open("https://github.com/shubham-kukreja/Cricketez")
              }
            >
              <AiFillGithub color={"white"} />
            </li>
            <li
              className="nav-item small-primary"
              onClick={() =>
                window.open("https://www.linkedin.com/in/shubham-kukreja/")
              }
            >
              <FaLinkedinIn color={"white"} />
            </li>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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
                Crypto Cricket League
              </motion.p>
            </div>
            <p className="text-muted">Scroll Down to learn more</p>
          </Col>
          <Col>
            <Login />
          </Col>
        </Row>
      </Container>
      <Row className="page page-dark"></Row>
      <div className="page image-backgorund">
        <div className="image-gradient-overlay"></div>
        <div className="overlay-text">
          <h1 className="page-heading">Compete</h1>
          <h4 className="page-subheading">Select your 5 player squad</h4>
          <br />
          <h4 className="text-muted page-subheading">
            Get ranked based on the performances of your players in real matches
          </h4>
        </div>
      </div>
      <Container>
        <div className="page steps-container">
          <StepsSvg />
        </div>
      </Container>

      <Row className="page page-dark">
        <Col>
          <h1 className="page-heading">No Betting</h1>
          <h4 className="page-subheading">Cause you never lose</h4>
          <br />
          <br />
          <br />
          <br />
          <div className="score-up">
            <div className="chevron"></div>
            <div className="chevron"></div>
            <div className="chevron"></div>
          </div>
          <br />
          <br />
          <h4 className="text-muted page-subheading w-200">
            Card Score always increases as you progress. Compete in Live Matches
            with zero-risk.
          </h4>
        </Col>
        <Col className="bg-custom-dark" style={{ textAlign: "center" }}>
          <PlayerCard select={true} data={{ key: 0 }} />
        </Col>
      </Row>
      <Row className="page ">
        <Col style={{ textAlign: "center" }}>
          <br />
          <br />
          <motion.img
            style={{ height: "75%" }}
            initial={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{ duration: 25, yoyo: Infinity }}
            src={require("../assests/tez-blockchain.png")}
          />
        </Col>
        <Col>
          <br />
          <br />
          <h1 className="page-heading">
            Safe, Secure <br />& Robust
          </h1>
          <h4 className="page-subheading">Built on the Tezos Blockchain</h4>
          <br />
          <br />
          <br />
          <br />
          <div className="score-up">
            <div className="chevron"></div>
            <div className="chevron"></div>
            <div className="chevron"></div>
          </div>
          <br />
          <br />
          <h4 className="text-muted page-subheading w-200">
            Each Card is a Non-fungible Token Stored on the Tezos Blockchain. No
            one can take away your card, not even us.
          </h4>
        </Col>
      </Row>
      <div className="page-footer">
        <p>Network : Carthagenet</p>
        <p>Contract Address : KT1PeyfZQ5uHyzXzx83t9WGKHk6pKmvcWvLC</p>
      </div>
    </Container>
  );
}

export default LoginPage;
