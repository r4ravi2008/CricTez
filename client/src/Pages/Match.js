import React from "react";
import { lazy } from "react";
import { Container } from "react-bootstrap";
import RouteTransition from "../components/RouteTransition/RouteTransition";

const Matches = lazy(() => import("../components/Matches/Matches"));

function Match() {
  return (
    <RouteTransition>
      <Container fluid>
        <Matches />
      </Container>
    </RouteTransition>
  );
}

export default Match;
