import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../context/auth/authContext";
import PlayerDetail from "../PlayerDetail/PlayerDetail";
import TxToast from "../TxToast/TxToast";
import "./CardDetail.css";

function CardDetails(props) {
  const [state] = useAuthContext();
  const [card, setCard] = useState({});
  const [price, setprice] = useState();
  const [tInitiated, setTInitiated] = useState(false);
  const [tCompleted, setTCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const histroy = useHistory();

  useEffect(() => {
    setCard(props.data);
  }, []);

  const buyToken = async () => {
    setError(null);
    setLoading(true);
    try {
      const operation = await state.contract.methods
        .buyToken(card.token_id)
        .send({ amount: parseInt(card?.sale?.price) / 1000000 });
      setTInitiated(true);
      await operation.confirmation();
      setTCompleted(true);
      setTimeout(() => {
        histroy.push("/owned");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const sellToken = async () => {
    setError(null);
    setLoading(true);
    try {
      const operation = await state.contract.methods
        .sellToken(price * 1000000, card.token_id)
        .send();
      setTInitiated(true);
      await operation.confirmation();
      setTCompleted(true);
      setTimeout(() => {
        histroy.push("/owned");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="card-detail-container">
        {card ? (
          <>
            <br />
            <br />
            <br />
            <Row className="card__info">
              <Col md={2}></Col>
              <Col className="card__column">
                <p>Key</p>
                <h4>{card.token_id}</h4>
              </Col>
              <Col className="card__column">
                <p>Card Score</p>
                <h4>{parseFloat(card?.card_score).toFixed(2)}</h4>
              </Col>
              {!card.owned && (
                <Col className="card__column">
                  <p>Price</p>
                  <h4>
                    {parseFloat(parseInt(card?.sale?.price) / 1000000).toFixed(
                      2
                    )}
                    <img
                      className="tez-logo"
                      src={require("../../assests/tez-logo.png")}
                    />
                  </h4>
                </Col>
              )}

              {card.owned && (
                <Col className="card__column">
                  <Form.Group className="formgroup__field light">
                    <Form.Label>Set Price </Form.Label>
                    <Form.Control
                      placeholder="Tez"
                      value={price}
                      onChange={(e) => setprice(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              )}

              {!card.owned && (
                <Col className="card__column">
                  <p>Owner</p>
                  <h4>{card?.sale?.owner?.slice(0, 10)}...</h4>
                </Col>
              )}

              <Col>
                <Button
                  className="card__buybutton"
                  onClick={card.owned ? sellToken : buyToken}
                  disabled={loading}
                >
                  {card.owned ? "Sell" : "Buy"}
                </Button>
              </Col>
              <div className="card-player-img-container">
                <img
                  className="card-player-img"
                  src={card.image_url}
                  alt="img"
                />
              </div>
            </Row>
          </>
        ) : (
          " "
        )}
        <div className="toast-container">
          {error ? <TxToast text={error} /> : null}
          {tInitiated ? (
            <TxToast text="Transaction Initiated. Waiting for confirmation" />
          ) : null}
          {tCompleted ? (
            <TxToast text="Transaction Completed. Redirecting to Owned Cards." />
          ) : null}
        </div>
      </div>
      <PlayerDetail data={props.data} showImage={false} />
    </React.Fragment>
  );
}

export default CardDetails;
