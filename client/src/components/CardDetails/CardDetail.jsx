import React, { useState, useEffect } from "react";
import PlayerDetail from "../PlayerDetail/PlayerDetail";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./CardDetail.css";
import { useAuthContext } from "../../context/auth/authContext";

function CardDetails(props) {
  const [state, dipatch] = useAuthContext();
  const [card, setCard] = useState({});
  const [tInitiated, setTInitiated] = useState(false);
  const [tCompleted, setTCompleted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCard(props.data);
    console.log(state);
  }, []);

  const buyToken = async () => {
    setError(null);
    setTInitiated(true);
    console.log("Transaction Initiated");
    console.log(card.sale.price);
    try {
      const operation = await state.contract.methods
        .buyToken(card.token_id)
        .send({ amount: parseInt(card?.sale?.price) / 1000000 });
      await operation.confirmation();
      console.log("Transaction Completed");
      setTCompleted(true);
    } catch (error) {
      setError(error.message);
    }
  };

  console.log(card);
  return (
    <React.Fragment>
      <div className="card-detail-container">
        <div className="error">{error}</div>
        {card ? (
          <Row className="card__info">
            <Col className="card__column" md={1}>
              <p>Key</p>
              <h4>{card.token_id}</h4>
            </Col>
            <Col className="card__column">
              <p>Card Score</p>
              <h4>{card.card_score}</h4>
            </Col>
            <Col className="card__column">
              <p>Price</p>
              <h4>{parseInt(card?.sale?.price) / 1000000} xtz</h4>
            </Col>
            <Col className="card__column">
              <p>Owner</p>
              <h4>{card?.sale?.owner}</h4>
            </Col>
            <Col>
              <Button className="card__buybutton" onClick={buyToken}>
                Buy
              </Button>
            </Col>
          </Row>
        ) : (
          " "
        )}
        {tCompleted ? "Token Bought Successfully" : ""}
      </div>
      <PlayerDetail data={props.data} />
    </React.Fragment>
  );
}

export default CardDetails;
