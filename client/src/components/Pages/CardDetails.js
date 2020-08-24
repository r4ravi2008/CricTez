import React from "react";
import { useParams, useHistory } from "react-router-dom";
import CardDetail from "../CardDetails/CardDetail.jsx";

function CardDetails(props) {
  let { id } = useParams();
  const history = useHistory();
  const data = history.location.state;
  // console.log(props)
  return <CardDetail data={data} />;
}

export default CardDetails;
