import React, { useEffect } from "react";
import { useState } from "react";
import { fetchTokenDetails } from "../../api/playerMetadata";
import { Card, Spinner, Button } from "react-bootstrap";
import "./PlayerCard.css";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

export default function PlayerCard(props) {
  const { data } = props;
  const [tokenDetails, setTokenDetails] = useState();
  const histroy = useHistory();

  useEffect(() => {
    fetchTokenDetails(data.key).then((res) => setTokenDetails(res));
  }, [data.key]);

  const navigate = () => {
    histroy.push(`/card/${tokenDetails.token_id}`, tokenDetails);
  };

  if (!tokenDetails) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Card className="player__card">
      <Card.Img
        variant="top"
        src={tokenDetails.image_url}
        className="player__image"
        onClick={navigate}
      />
      <Card.Body onClick={navigate}>
        <Card.Title className="player__name">{tokenDetails.name}</Card.Title>
        <div className="player__info heading">
          <div>Matches</div>
          <div>Runs</div>
          <div>Wickets</div>
        </div>
        <div className="player__info">
          <div>{tokenDetails.matches}</div>
          <div>{tokenDetails.runs}</div>
          <div>{tokenDetails.wickets}</div>
        </div>
      </Card.Body>
      <Card.Footer className="player__footer">
        <div className="text-muted">Token ID : {tokenDetails.token_id}</div>
        {tokenDetails.role} <br />
        {props.owned ? (
          <Button
            className="btn-warning"
            onClick={() => histroy.push("/sell/token/", tokenDetails)}
          >
            Sell
          </Button>
        ) : (
          ""
        )}
      </Card.Footer>
    </Card>
  );
}
