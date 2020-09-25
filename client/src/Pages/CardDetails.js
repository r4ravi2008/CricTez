import React from "react";
import { lazy } from "react";
import { useHistory, useParams } from "react-router-dom";
import RouteTransition from "../components/RouteTransition/RouteTransition.jsx";


const CardDetail = lazy(() =>
  import("../components/CardDetails/CardDetail.jsx")
);

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
