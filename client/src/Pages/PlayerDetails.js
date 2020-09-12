import React from "react";
import { useParams } from "react-router-dom";
import PlayerDetail from "../components/PlayerDetail/PlayerDetail.jsx";
import RouteTransition from "../components/RouteTransition/RouteTransition.jsx";

function PlayerDetails() {
  let { id } = useParams();
  return (
    <RouteTransition>
      <PlayerDetail id={id} />
    </RouteTransition>
  );
}

export default PlayerDetails;
