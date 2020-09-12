import React from "react";
import PageHeading from "../components/PageHeading/PageHeading";
import { useAuthContext } from "../context/auth/authContext";
import { Container } from "react-bootstrap";
import RouteTransition from "../components/RouteTransition/RouteTransition";

function Profile() {
  const [state, dispatch] = useAuthContext();
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
          <h4 className="text-muted">Owned Tokens</h4>
          <h1 className="profile-address">20</h1>
        </div>
      </Container>
    </RouteTransition>
  );
}

export default Profile;
