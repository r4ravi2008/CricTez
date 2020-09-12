import React, { useState, useEffect } from "react";
import "./PlayerDetail.css";
import { Container, Row, Col } from "react-bootstrap";
import { teamColors } from "../../constants/teamColors";
import { motion, AnimatePresence } from "framer-motion";
import PageHeading from "../PageHeading/PageHeading";

function PlayerDetail(props) {
  const [data, setData] = useState({});

  const variants = {
    visible: { opacity: 1, transition: { duration: 0.75 } },
    hidden: { opacity: 0 },
    exit: { scale: 0.5, transition: { duration: 0.75 } },
  };
  const variantsUp = {
    initial: { opacity: 0, y: "-100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };
  const variantsDown = {
    initial: { opacity: 0, y: "100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };

  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="player-detail-container"
        initial="hidden"
        variants={variants}
        animate="visible"
        exit={{ opacity: 0 }}
        transition={{ type: "tween", duration: 5 }}
      >
        <Row
          className="playerdetails__hero"
          style={{ backgroundColor: teamColors[data.team] }}
        >
          {props.showImage ? (
            <Col md={3} className="playerdetails__image">
              <img src={data?.image_url} alt="" />
            </Col>
          ) : null}
          <Col md={props.showImage ? 3 : 4} className="playerdetails__info">
            <div className="playerdetails__name">
              <div style={{ overflow: "hidden", height: "2.2rem" }}>
                <motion.h3
                  className="playerdetails-firstname"
                  initial="initial"
                  animate="final"
                  variants={variantsDown}
                >
                  {data.name ? data.name.split(" ")[0] : "loading"}
                </motion.h3>
              </div>
              <div style={{ overflow: "hidden", height: "3.2rem" }}>
                <motion.h1
                  className="playerdetails-lastname"
                  initial="initial"
                  animate="final"
                  variants={variantsUp}
                >
                  {data.name ? data.name.split(" ")[1] : "loading"}
                </motion.h1>
              </div>
            </div>
            <div className="playerdetails__role">
              <h3>
                {data.nationality} {data.role}
              </h3>
              <p>{data.team}</p>
            </div>
          </Col>
          <Col
            md={props.showImage ? 2 : 4}
            className="playerdetails__stats score"
          >
            <div className="player__info playerdetails__heading">
              <div>Player Score</div>
            </div>
            <div className="player__info playerdetails__value">
              <div>{data.points}</div>
            </div>
          </Col>
          <Col md={4} className="playerdetails__stats">
            <div className="player__info playerdetails__heading">
              <div>Matches</div>
              <div>Runs</div>
              <div>Wickets</div>
            </div>
            <div className="player__info playerdetails__value">
              <div>{data.matches}</div>
              <div>{data.runs}</div>
              <div>{data.wickets}</div>
            </div>
          </Col>
        </Row>
        <div className="playerdetails__bio">{data.bio}</div>
        <div className="player__details__stats">
          <div className="batting__stats">
            <h3></h3>
          </div>
          <br />
          <div className="bowling__stats">
            <h3></h3>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PlayerDetail;
