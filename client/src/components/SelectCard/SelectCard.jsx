import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { fetchTokenDetails } from "../../api/playerMetadata";
import { teamColors } from "../../constants/teamColors";
import "./SelectCard.css";

export default function SelectCard(props) {
  const { data, selectedTokens, setselectedTokens } = props;
  const [tokenDetails, setTokenDetails] = useState();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    fetchTokenDetails(data.key).then((res) => setTokenDetails(res));
  }, [data.key]);

  const variants = {
    visible: { opacity: 1, transition: { duration: 0.75 } },
    hidden: { opacity: 0 },
  };

  const selectCard = () => {
    if (selected) {
      setSelected(false);
      setselectedTokens(
        selectedTokens.filter((item) => item.token_id !== tokenDetails.token_id)
      );
    } else {
      if (selectedTokens.length >= 5) {
        window.alert("Max 5 Players Allowed");
        return;
      }
      setSelected(true);
      setselectedTokens((prev) => [...prev, tokenDetails]);
    }
  };

  const SkeletonCard = () => (
    <motion.div
      className="card-container"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <Card className="player-card">
        <Card.Body>
          <div
            className={selected ? "wrapper-dark selected-card" : "wrapper-dark"}
          >
            <div className="card-upper">
              <div className="card-price-section"></div>
              <div className="card-usd-heading"></div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
  console.log(tokenDetails);

  return tokenDetails ? (
    <motion.div
      className="card-container"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <Card
        className="player-card"
        onClick={props.selectable ? selectCard : null}
        style={
          props.select && tokenDetails.sale.price ? { display: "none" } : {}
        }
      >
        <Card.Body>
          <div
            className="wrapper-dark"
            style={
              selected && props.selectable
                ? {
                    borderColor: teamColors[tokenDetails.team],
                    borderWidth: 3,
                    borderStyle: "dashed",
                  }
                : {}
            }
          >
            <div className="card-upper select-card-upper">
              <div>
                <div className="card-price-heading">Rank</div>
                <div className="card-price-section">
                  <div className="price-value loader">{tokenDetails.rank}</div>
                </div>
              </div>
              <div className="card-usd-heading"></div>
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
            <div className="player-role">{tokenDetails.role}</div>
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
  ) : (
    <SkeletonCard />
  );
}
