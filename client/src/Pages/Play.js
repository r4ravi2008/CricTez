import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { fetchOwnedTokens, getMatches } from "../api/playerMetadata";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import SelectCard from "../components/SelectCard/SelectCard";
import { useAuthContext } from "../context/auth/authContext";
import MatchCard from "../components/MatchCard/MatchCard";
import TxToast from "../components/TxToast/TxToast";

function Play() {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);
  const [selectedTokens, setselectedTokens] = useState([]);
  const [match, setMatch] = useState({
    key: null,
  });
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txInitiated, setTxInitiated] = useState(false);
  const [txCompleted, setTxCompleted] = useState(false);

  useEffect(() => {
    if (state.userAddress) {
      window.scrollTo(0, 0);
      setLoading(true);
      getMatches().then((res) => {
        res = res.filter((item) => item.active);
        if (res.length !== 0) setMatch(res[0]);
      });
      fetchOwnedTokens(state.userAddress).then((res) => setTokens(res));
      setLoading(false);
    }
  }, [state]);

  const showCards = (match) => {
    return !tokens.length ? (
      <h3>Warming Up...</h3>
    ) : (
      <RouteTransition>
        {tokens.map((token, index) => (
          <SelectCard
            key={index}
            data={{ key: token }}
            owned={true}
            select={true}
            selectedTokens={selectedTokens}
            setselectedTokens={setselectedTokens}
            selectable={true}
            match={match}
          />
        ))}
      </RouteTransition>
    );
  };

  const confirmCards = () => {
    return (
      <RouteTransition>
        {selectedTokens.map((token, index) => (
          <SelectCard
            key={index}
            data={{ key: token.token_id }}
            owned={true}
            selectedTokens={selectedTokens}
            setselectedTokens={setselectedTokens}
            selectable={false}
          />
        ))}
      </RouteTransition>
    );
  };

  const selectTeamTx = async () => {
    if (page) {
      setError(null);
      setLoading(true);
      const tokens = selectedTokens.map((item) => item.token_id);
      try {
        const operation = await state.contract.methods
          .selectTeam(match.key, tokens)
          .send();
        setTxInitiated(true);
        await operation.confirmation();
        setTxCompleted(true);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    } else {
      setPage(1);
    }
  };

  return (
    <>
      <Row>
        <Col style={{ textAlign: "left" }}>
          <PageHeading text={page ? "Confirm Players" : "Choose Players"} />
        </Col>
        <Col md={page ? 5 : 3}>
          <br />
          <br />
          {page ? (
            <Button
              className="big-button"
              onClick={() => {
                setPage(0);
                setselectedTokens([]);
              }}
            >
              Change
            </Button>
          ) : null}
          <Button
            className="big-button"
            disabled={selectedTokens.length !== 5 || txCompleted || loading}
            onClick={selectTeamTx}
          >
            {page ? "Compete" : "Continue"}
          </Button>
        </Col>
      </Row>

      <Container fluid style={{ textAlign: "center" }}>
        {match.key ? (
          <>
            <Container>
              <MatchCard key={match.key} data={match} />
            </Container>
            {!page && showCards(match)}
            {page && confirmCards()}
          </>
        ) : (
          <h1 className="color-accent">No Active Matches</h1>
        )}

        <br />
      </Container>
      <div className="toast-container">
        {error ? <TxToast text={error} /> : null}
        {txInitiated ? <TxToast text="Transaction Initiated" /> : null}
        {txCompleted ? <TxToast text="Transaction Completed" /> : null}
      </div>
    </>
  );
}

export default Play;
