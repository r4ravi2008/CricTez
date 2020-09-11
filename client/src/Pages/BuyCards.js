import React, { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import Container from "react-bootstrap/Container";
import { fetchTokensOnSale } from "../api/playerMetadata";
import PageHeading from "../components/PageHeading/PageHeading";
import { useAuthContext } from "../context/auth/authContext";
import { Row, Col } from "react-bootstrap";
import Balance from "../components/Balance/Balance";

function BuyCards() {
  const [tokens, setTokens] = useState([]);
  const [state, dispatch] = useAuthContext();
  useEffect(() => {
    fetchTokensOnSale().then((res) => setTokens(res));
    window.scrollTo(0, 0);
  }, []);
  console.log(state);

  return (
    <>
      <Balance text="Buy Cards" balance />
      <Container fluid={true} style={{ textAlign: "center" }}>
        {!tokens.length ? (
          <h3>Loading...</h3>
        ) : (
          tokens.map((token, index) => (
            <PlayerCard key={index} data={token} owned={false} />
          ))
        )}
      </Container>
    </>
  );
}

export default BuyCards;
