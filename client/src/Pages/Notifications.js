import React from "react";
import { Container } from "react-bootstrap";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";

function Notifications() {
  return (
    <RouteTransition>
      <PageHeading text="Notifications" />
      <Container>
        <h4 style={{ color: "white" }}>No New Notifications</h4>
      </Container>
    </RouteTransition>
  );
}

export default Notifications;
