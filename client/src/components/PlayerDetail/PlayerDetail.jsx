import React, { useState, useEffect } from "react";
import "./PlayerDetail.css";
import { Container, Row, Col } from "react-bootstrap";
import { teamColors } from "../../constants/teamColors";

function PlayerDetail(props) {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(props.data);
  }, [props]);

  return (
    <div className="player-detail-container">
      <Row
        className="playerdetails__hero"
        style={{ backgroundColor: teamColors[data.team] }}
      >
        {props.showImage ? (
          <Col md={3} className="playerdetails__image">
            <img src={data.image_url} alt="" />
          </Col>
        ) : null}
        <Col md={props.showImage ? 3 : 4} className="playerdetails__info">
          <div className="playerdetails__name">
            <h3>{data.name ? data.name.split(" ")[0] : "loading"}</h3>
            <h1>{data.name ? data.name.split(" ")[1] : "loading"}</h1>
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
      <div className="playerdetails__bio">
        {data.bio}
      </div>
      <div className="player__details__stats">
        <div className="batting__stats">
          <h3></h3>
        </div>
        <br />
        <div className="bowling__stats">
          <h3></h3>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetail;
