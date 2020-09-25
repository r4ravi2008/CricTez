import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { fetchTokensOnSale } from "../api/playerMetadata";
import Balance from "../components/Balance/Balance";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import SortType from "../components/SortType/SortType";
import { useAuthContext } from "../context/auth/authContext";
import "./styles.css";


function BuyCards() {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTokensOnSale().then((res) => {
      setTokens(res);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Balance text="Buy Cards" balance />
      <div className="sort-container">
        <SortType tokens={tokens} setTokens={setTokens} />
      </div>
      <Container fluid={true} style={{ textAlign: "center" }}>
        {loading && <Spinner animation={"border"} />}
        {!loading && !tokens.length ? (
          <h3 className="color-accent">No Cards on Sale</h3>
        ) : (
          <RouteTransition delay>
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
