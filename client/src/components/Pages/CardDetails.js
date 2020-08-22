import React from 'react'
import { useParams } from "react-router-dom";
import CardDetail from "../CardDetails/CardDetail.jsx"

function CardDetails() {
    let { id } = useParams();
    return (
        <CardDetail id={id} />
    )
}

export default CardDetails
