import React, { useEffect, useState } from "react";
import PlayerCard from "../PlayerCard/PlayerCard";
import Container from "react-bootstrap/Container";
import { fetchTokensOnSale } from "../../api/playerMetadata";

function BuyCards() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetchTokensOnSale().then((res) => setTokens(res));
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container fluid={true} style={{ textAlign: "center" }}>
      {!tokens.length ? (
        <h3>Loading...</h3>
      ) : (
        tokens.map((token, index) => (
          <PlayerCard key={index} data={token} owned={false} />
        ))
      )}
    </Container>
  );
}

export default BuyCards;
