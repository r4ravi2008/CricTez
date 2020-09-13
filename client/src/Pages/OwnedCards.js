import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { fetchOwnedTokens } from "../api/playerMetadata";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import { useAuthContext } from "../context/auth/authContext";
import PageHeading from "../components/PageHeading/PageHeading";
import Balance from "../components/Balance/Balance";
import { motion } from "framer-motion";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { SET_NAVBAR_HEADING } from "../context/types";

function OwnedCards(props) {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (state.userAddress)
      fetchOwnedTokens(state.userAddress).then((res) => setTokens(res));
  }, [state]);

  useEffect(() => {
    dispatch({
      type: SET_NAVBAR_HEADING,
      payload: {
        heading: props.sellpage ? "Sell Cards" : "Owned Cards",
      },
    });
  }, []);

  return (
    <>
      <Balance text={props.sellpage ? "Sell Cards" : "Owned Cards"} balance />
      <Container fluid style={{ textAlign: "center" }}>
        {!tokens.length ? (
          <h3>Warming Up...</h3>
        ) : (
          <RouteTransition>
            {tokens.map((token, index) => (
              <PlayerCard key={index} data={{ key: token }} owned={true} />
            ))}
          </RouteTransition>
        )}
      </Container>
    </>
  );
}

export default OwnedCards;
