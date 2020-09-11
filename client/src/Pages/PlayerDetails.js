import React from "react";
import { useParams } from "react-router-dom";
import PlayerDetail from "../components/PlayerDetail/PlayerDetail.jsx";

function PlayerDetails() {
  let { id } = useParams();
  return <PlayerDetail id={id} />;
}

export default PlayerDetails;
