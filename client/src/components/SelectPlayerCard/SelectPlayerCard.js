import React, { useEffect, Fragment } from "react";
import { useState } from "react";
import { fetchTokenDetails } from "../../api/playerMetadata";
import { Card, Spinner, Button } from "react-bootstrap";
import "./SelectPlayerCard.css";
import { useHistory } from "react-router-dom";
import { teamColors } from "../../constants/teamColors";
import { motion, AnimatePresence } from "framer-motion";
import { LinkContainer } from "react-router-bootstrap";

export default function SelectPlayerCard(props) {
  const { data } = props;
  const [tokenDetails, setTokenDetails] = useState();
  const [owned, setOwned] = useState(false);
  const histroy = useHistory();

  useEffect(() => {
    fetchTokenDetails(data.key).then((res) => {
      if (res?.sale && !Object.keys(res?.sale).length) setTokenDetails(res);
      else setOwned(true);
    });
  }, [data.key]);

  const navigate = () => {
    histroy.push(`/card/${tokenDetails.token_id}`, tokenDetails);
  };

  const variants = {
    visible: { opacity: 1, transition: { duration: 0.75 } },
    hidden: { opacity: 0 },
  };

  const setPlayer = () => {
    props.setBatsman(tokenDetails);
  };

  const SkeletonCard = () => (
    <AnimatePresence>
      <motion.div
        drag
        className="card-container"
        variants={variants}
        initial="hidden"
        animate="visible"
      >
        <Card className="player-card select-player-small">
          <Card.Body>
            <div className="wrapper-dark wrapper-dark-small">
              <div className="card-upper">
                <div className="card-price-heading"></div>
                <div className="card-price-section"></div>
                <div className="card-usd-heading"></div>
              </div>
            </div>
          </Card.Body>
          <div className="card-lower">
            <div className="player-name-section">
              <div className="player-firstname"></div>
              <div className="player-lastname"></div>
              <div className="player-role"></div>
            </div>

            <div className="card-score-section"></div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );

  return tokenDetails && !owned ? (
    <motion.div
      className="card-container"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <Card className="player-card select-player-small" onClick={setPlayer}>
        <Card.Body>
          <div className="wrapper-dark wrapper-dark-small">
            <div className="card-upper">
              <div className="card-price-heading"></div>
              <div className="card-price-section"></div>
              <div className="card-usd-heading"></div>
            </div>
          </div>
        </Card.Body>
        <div
          className="card-lower"
          style={{ backgroundColor: teamColors[tokenDetails.team] }}
        >
          <div className="player-name-section">
            <div className="player-firstname">
              {tokenDetails.name.split(" ")[0]}
            </div>
            <div className="player-lastname">
              {tokenDetails.name.split(" ")[1].slice(0,6)}
            </div>
            <div className="player-role">{tokenDetails.image_url.role}</div>
          </div>
          <div className="card-score-section">
            <div className="score-heading">Card Score</div>
            <div className="score-value">
              {parseFloat(tokenDetails.card_score).toFixed(2)}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  ) : !owned ? (
    <SkeletonCard />
  ) : null;
}
