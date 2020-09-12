import React, { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import Container from "react-bootstrap/Container";
import { fetchTokensOnSale } from "../api/playerMetadata";
import { useAuthContext } from "../context/auth/authContext";
import Balance from "../components/Balance/Balance";
import RouteTransition from "../components/RouteTransition/RouteTransition";

function BuyCards() {
  const [tokens, setTokens] = useState([]);
  const [] = useAuthContext();
  useEffect(() => {
    fetchTokensOnSale().then((res) => setTokens(res));
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Balance text="Buy Cards" balance />

      <Container fluid={true} style={{ textAlign: "center" }}>
        {!tokens.length ? (
          <h3>Loading...</h3>
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
