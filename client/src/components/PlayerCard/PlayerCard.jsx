import React, { useEffect, Fragment } from "react";
import { useState } from "react";
import { fetchTokenDetails } from "../../api/playerMetadata";
import { Card, Spinner, Button } from "react-bootstrap";
import "./PlayerCard.css";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { teamColors } from "../../constants/teamColors";

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
    <Card className="player-card">
      <Card.Body onClick={navigate}>
        <div className="wrapper-dark">
          <div className="card-upper">
            <div className="card-price-heading">
              {tokenDetails.sale.price ? (
                "Price"
              ) : (
                <a
                  className="sell-button"
                  style={{
                    borderColor: teamColors[tokenDetails.team],
                    borderWidth: 1,
                    borderStyle : "solid"
                  }}
                >
                  Sell
                </a>
              )}
            </div>
            <div className="card-price-section">
              {tokenDetails.sale.price ? (
                <Fragment>
                  <div className="price-value">
                    {parseFloat(
                      parseInt(tokenDetails.sale.price) / 1000000
                    ).toFixed(2)}
                  </div>
                  <img
                    className="tez-logo"
                    src={require("../../assests/tez-logo.png")}
                  />
                </Fragment>
              ) : (
                <div className="price-value">Owned</div>
              )}
            </div>
            <div className="card-usd-heading">
              {tokenDetails.sale.price ? "$ 26.75" : "$ 0.00"}
            </div>
          </div>
        </div>
      </Card.Body>
      <div className="player-image">
        <img className="playerimage" src={tokenDetails.image_url} alt="img" />
      </div>
      <div
        className="card-lower"
        style={{ backgroundColor: teamColors[tokenDetails.team] }}
      >
        <div className="player-name-section">
          <div className="player-firstname">
            {tokenDetails.name.split(" ")[0]}
          </div>
          <div className="player-lastname">
            {tokenDetails.name.split(" ")[1]}
          </div>
          <div className="player-role">{tokenDetails.image_url.role}</div>
        </div>
        <div className="team-logo">
          <img src={require("../../assests/rcb-logo.png")} alt="" />
        </div>
        <div className="card-score-section">
          <div className="score-heading">Card Score</div>
          <div className="score-value">
            {parseFloat(tokenDetails.card_score).toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
}
