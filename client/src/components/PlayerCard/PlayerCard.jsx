import React, { useEffect } from "react";
import { getBigMap } from "../../api/tzStatsApi";
import { playersBigmap, tokensBigmap } from "../../constants/contract";
import { useState } from "react";
import { getPlayerMetadata } from "../../api/playerMetadata";
import { playerData } from "../../utils/dummyData";
import { Button, Card, CardGroup, CardDeck } from "react-bootstrap";
import "./PlayerCard.css";
import { LinkContainer } from "react-router-bootstrap";

export default function PlayerCard(props) {
  const { data } = props;
  const [tokenDetails, setTokenDetails] = useState();
  const [playerDetails, setPlayerDetails] = useState({});
  const [, setPlayerExtraDetails] = useState();

  // useEffect(() => {
  //   fetchTokenDetails();
  //   cricApifunction();
  // }, []);

  // useEffect(() => {
  //   fetchPlayerDetails();
  // }, [tokenDetails]);

  // useEffect(() => {
  //   fetchPlayerMetaData();
  // }, [playerDetails]);

  // useEffect(() => {
  //   setPlayerDetails(playerData[0]);
  // }, []);

  return (
    <LinkContainer to={`/card/${data.player_id}`}>
      <Card className="player__card">
        <Card.Img
          variant="top"
          src={data.image_url}
          className="player__image"
        />
        <Card.Body>
          <Card.Title className="player__name">{data.name}</Card.Title>
          <div className="player__info heading">
            <div>Matches</div>
            <div>Runs</div>
            <div>Wickets</div>
          </div>
          <div className="player__info">
            <div>{data.matches}</div>
            <div>{data.runs}</div>
            <div>{data.wickets}</div>
          </div>
        </Card.Body>
        <Card.Footer className="player__footer">{data.role}</Card.Footer>
      </Card>
    </LinkContainer>
  );
}
