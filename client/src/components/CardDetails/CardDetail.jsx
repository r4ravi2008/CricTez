import React, { useState, useEffect } from "react";
import PlayerDetail from "../PlayerDetail/PlayerDetail";
import { tokensForSale } from "../../utils/dummyData";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./CardDetail.css";

function CardDetails(props) {
  const id = props.id;
  const [card, setCard] = useState({});

  useEffect(() => {
    setCard(tokensForSale[0]);
  }, []);

  return (
    <React.Fragment>
      <Container>
        <br />
        {card.value ? (
          <div>
            <Row className="card__info">
              <Col className="card__column" md={1}>
                <p>Key</p>
                <h4>{card.key}</h4>
              </Col>
              <Col className="card__column">
                <p>Card Score</p>
                <h4>2.74</h4>
              </Col>
              <Col className="card__column">
                <p>Price</p>
                <h4>{parseInt(card.value.price) / 1000000} xtz</h4>
              </Col>
              <Col className="card__column">
                <p>Owner</p>
                <h4>{card.value.owner}</h4>
              </Col>
              <Col>
                <Button className="card__buybutton">Buy</Button>
              </Col>
            </Row>
            <br />
            <hr />
            <br />
          </div>
        ) : (
          <h1>Loading</h1>
        )}
      </Container>
      <PlayerDetail id={card.player_id} />
    </React.Fragment>
  );
}

export default CardDetails;
