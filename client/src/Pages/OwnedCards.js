import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { fetchOwnedTokens } from "../api/playerMetadata";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import { useAuthContext } from "../context/auth/authContext";
import PageHeading from "../components/PageHeading/PageHeading";

function OwnedCards(props) {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (state.userAddress)
      fetchOwnedTokens(state.userAddress).then((res) => setTokens(res));
  }, [state]);

  return (
    <>
      <PageHeading text={props.sellpage ? "Sell Cards" : "Owned Cards"} />
      <Container fluid style={{ textAlign: "center" }}>
        {!tokens.length ? (
          <h3>Loading...</h3>
        ) : (
          tokens.map((token, index) => (
            <PlayerCard key={index} data={{ key: token }} owned={true} />
          ))
        )}
      </Container>
    </>
  );
}

export default OwnedCards;
