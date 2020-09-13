import React, { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import Container from "react-bootstrap/Container";
import { fetchTokensOnSale } from "../api/playerMetadata";
import { useAuthContext } from "../context/auth/authContext";
import Balance from "../components/Balance/Balance";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import "./styles.css";
import { SET_NAVBAR_HEADING } from "../context/types";

function BuyCards() {
  const [tokens, setTokens] = useState([]);
  const [state, dispatch] = useAuthContext();
  useEffect(() => {
    fetchTokensOnSale().then((res) => setTokens(res));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch({
      type: SET_NAVBAR_HEADING,
      payload: {
        heading: "Buy Cards",
      },
    });
  }, []);

  return (
    <>
      <Balance text="Buy Cards" balance />

      <Container fluid={true} style={{ textAlign: "center" }}>
        {!tokens.length ? (
          <h3>Warming Up...</h3>
        ) : (
          <RouteTransition>
            {tokens.map((token, index) => (
              <PlayerCard key={index} data={token} owned={false} />
            ))}
          </RouteTransition>
        )}
      </Container>
    </>
  );
}

export default BuyCards;
