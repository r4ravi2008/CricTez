import React, { lazy, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { fetchOwnedTokens } from "../api/playerMetadata";
import Balance from "../components/Balance/Balance";
import { useAuthContext } from "../context/auth/authContext";


const PlayerCard = lazy(() => import("../components/PlayerCard/PlayerCard"));
const RouteTransition = lazy(() =>
  import("../components/RouteTransition/RouteTransition")
);

function OwnedCards(props) {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.userAddress) {
      setLoading(true);
      fetchOwnedTokens(state.userAddress).then((res) => {
        setTokens(res);
        setLoading(false);
      });
    }
  }, []);

  return (
    <>
      <Balance text={props.sellpage ? "Sell Cards" : "Owned Cards"} balance />
      <Container fluid style={{ textAlign: "center" }}>
        {loading && <Spinner animation={"border"} />}
        {!loading && !tokens.length ? (
          <h3 className="color-accent">No Owned Cards </h3>
        ) : (
          <RouteTransition delay>
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
