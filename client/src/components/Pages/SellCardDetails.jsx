import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PlayerCard from "../PlayerCard/PlayerCard";
import PlayerDetail from "../PlayerDetail/PlayerDetail";
import { Container, Form, Button } from "react-bootstrap";
import "./styles.css";
import { useAuthContext } from "../../context/auth/authContext";

function SellCardDetails(props) {
  const [state, dispatch] = useAuthContext();
  const history = useHistory();
  const data = history.location.state;
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const [tInitiated, setTInitiated] = useState(false);
  const [tCompleted, setTCompleted] = useState(false);

  const sellToken = async () => {
    setError(null);
    setTInitiated(true);
    console.log("Transaction Initiated");
    try {
      const operation = await state.contract.methods
        .sellToken(price, data.token_id)
        .send();
      await operation.confirmation();
      console.log("Transaction Completed");
      setTCompleted(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Container style={{ textAlign: "center" }}>
        {error}
        <Form className="card__sellform">
          <Form.Group className="formgroup__field">
            <Form.Label>Token ID : </Form.Label>
            <Form.Control
              placeholder="Token Id"
              value={data.token_id}
              disabled
            />
          </Form.Group>
          <Form.Group className="formgroup__field">
            <Form.Label>Set Price : </Form.Label>
            <Form.Control
              type="text"
              placeholder="mutez"
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Button
          variant="outline-primary"
          type="submit"
          className="sell__button"
          onClick={sellToken}
        >
          Sell
        </Button>
        {tCompleted ? "Token Listed on MarketPlace Successfully" : ""}
      </Container>
      <PlayerDetail data={data} />
    </div>
  );
}

export default SellCardDetails;
