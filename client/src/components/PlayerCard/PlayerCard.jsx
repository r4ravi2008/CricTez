import { motion } from "framer-motion";
import React, { Fragment, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";
import { fetchTokenDetails } from "../../api/playerMetadata";
import { teamColors, teamsInvert } from "../../constants/teams";
import { useAuthContext } from "../../context/auth/authContext";
import { ADD_CARD_DETAILS } from "../../context/types";
import "./PlayerCard.css";

export default function PlayerCard(props) {
  const { data } = props;
  const [tokenDetails, setTokenDetails] = useState();
  const [state, dispatch] = useAuthContext();
  const [teamLogoUrl, setTeamLogoUrl] = useState("");

  const histroy = useHistory();

  useEffect(() => {
    const cachedData = state.tokenDetails.filter(
      (token) => token.token_id === data.key.toString()
    );
    if (cachedData.length == 1) {
      setTokenDetails(cachedData[0]);
      return;
    }
    fetchTokenDetails(data.key).then((res) => {
      setTokenDetails(res);
      dispatch({
        type: ADD_CARD_DETAILS,
        payload: { token: res },
      });
    });
  }, [data.key]);

  const navigate = () => {
    histroy.push(
      `/card/${tokenDetails.token_id}`,
      tokenDetails.sale.price
        ? { ...tokenDetails, owned: false }
        : { ...tokenDetails, owned: true }
    );
  };

  const variants = {
    visible: { opacity: 1, transition: { duration: 0.75 } },
    hidden: { opacity: 0 },
    exit: { opacity: 0, transition: { duration: 0.75 } },
  };

  const SkeletonCard = () => (
    <motion.div
      className="card-container"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <Card className="player-card">
        <Card.Body>
          <div className="wrapper-dark">
            <div className="card-upper">
              <div className="card-price-heading">Price</div>
              <div className="card-price-section">
                <div className="price-value loader">Loading...</div>
              </div>
              <div className="card-usd-heading">$ 0.00</div>
            </div>
          </div>
        </Card.Body>
        <div className="player-image"></div>
      </Card>
    </motion.div>
  );

  return tokenDetails ? (
    <motion.div
      className="card-container"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <Card
        className="player-card"
        onClick={props.select ? null : navigate}
        style={
          props.select && !tokenDetails.sale.price ? { display: "none" } : {}
        }
      >
        <Card.Body>
          <div className="wrapper-dark">
            <div className="card-upper">
              <div className="card-price-heading">
                {tokenDetails.sale.price ? (
                  "Price"
                ) : (
                  <a
                    className="sell-button"
                    style={{
                      backgroundColor: teamColors[tokenDetails.team],
                      zIndex: 2,
                    }}
                    onClick={() => console.log(tokenDetails.token_id)}
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

        <motion.div
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
            <div className="player-role">{tokenDetails.role.split(" ")[0]}</div>
          </div>
          <div className="team-logo">
            <img
              src={`https://tranquil-earth-81896.herokuapp.com/teams/${
                teamsInvert[tokenDetails.team]
              }-logo.png`}
              alt="Player"
            />
          </div>
          <div className="card-score-section">
            <div className="score-heading">Card Score</div>
            <div className="score-value">
              {parseFloat(tokenDetails.card_score).toFixed(2)}
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  ) : (
    <SkeletonCard />
  );
}
