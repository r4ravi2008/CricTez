import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { useAuthContext } from "../context/auth/authContext";
import { SET_NAVBAR_HEADING } from "../context/types";

function Profile() {
  const [state, dispatch] = useAuthContext();

  const [showA, setShowA] = useState(true);

  const toggleShowA = () => setShowA(!showA);

  return (
    <RouteTransition>
      <PageHeading text="Your Profile" />
      <Container fluid>
        <div className="profile-container">
          <h4 className="text-muted">Your Address</h4>
          <h1 className="profile-address">{state?.userAddress}</h1>
          <hr />
          <h4 className="text-muted">Balance</h4>
          <div style={{ display: "flex" }}>
            <h1 className="profile-address">{state?.balance}</h1>
            <img
              className="tez-logo"
              src={require("../assests/tez-logo.png")}
            />
          </div>
        </div>
      </Container>
    </RouteTransition>
  );
}

export default Profile;
