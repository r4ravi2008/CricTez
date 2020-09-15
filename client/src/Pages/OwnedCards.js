import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { fetchOwnedTokens } from "../api/playerMetadata";
import Balance from "../components/Balance/Balance";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { useAuthContext } from "../context/auth/authContext";
import { SET_OWNED_CARDS } from "../context/types";

function OwnedCards(props) {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (state.userAddress)
      fetchOwnedTokens(state.userAddress).then((res) => {
        setTokens(res);
        dispatch({
          type: SET_OWNED_CARDS,
          payload: { cards: res },
        });
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
