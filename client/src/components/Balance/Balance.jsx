import React from "react";
import { Col, Row } from "react-bootstrap";
import { useAuthContext } from "../../context/auth/authContext";
import PageHeading from "../PageHeading/PageHeading";
import "./Balance.css";

function Balance(props) {
  const [state, dispatch] = useAuthContext();

  return (
    <Row>
      <Col md={9}>
        <PageHeading text={props.text} />
      </Col>
      {props.balance ? (
        <Col md={3}>
          <div className="balance-container">
            <br />
            <h4>Balance</h4>
            <div style={{ display: "flex" }}>
              <h1 className="balance-heading">{state?.balance}</h1>
              <img
                className="tez-logo"
                src={require("../../assests/tez-logo.png")}
              />
            </div>
          </div>
        </Col>
      ) : null}
    </Row>
  );
}

export default Balance;
