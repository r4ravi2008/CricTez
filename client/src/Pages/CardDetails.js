import React from "react";
import { useParams, useHistory } from "react-router-dom";
import CardDetail from "../components/CardDetails/CardDetail.jsx";
import RouteTransition from "../components/RouteTransition/RouteTransition.jsx";

function CardDetails(props) {
  let { id } = useParams();
  const history = useHistory();
  const data = history.location.state;
  // console.log(props)
  return (
    <RouteTransition>
      <CardDetail data={data} />
    </RouteTransition>
  );
}

export default CardDetails;
