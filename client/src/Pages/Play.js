import React, { Fragment, useEffect, useState } from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import { fetchOwnedTokens } from "../api/playerMetadata";
import PageHeading from "../components/PageHeading/PageHeading";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import SelectCard from "../components/SelectCard/SelectCard";
import { useAuthContext } from "../context/auth/authContext";

function Play() {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);
  const [selectedTokens, setselectedTokens] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (state.userAddress)
      fetchOwnedTokens(state.userAddress).then((res) => setTokens(res));
  }, [state]);

  const showCards = () => {
    return !tokens.length ? (
      <h3>Loading...</h3>
    ) : (
      tokens.map((token, index) => (
        <SelectCard
          key={index}
          data={{ key: token }}
          owned={true}
          select={true}
          selectedTokens={selectedTokens}
          setselectedTokens={setselectedTokens}
          selectable={true}
        />
      ))
    );
  };

  const confirmCards = () => {
    return selectedTokens.map((token, index) => (
      <SelectCard
        key={index}
        data={{ key: token.token_id }}
        owned={true}
        selectedTokens={selectedTokens}
        setselectedTokens={setselectedTokens}
        selectable={false}
      />
    ));
  };

  const handleClick = () => {
    if (page) {
      console.log("Make Transaction");
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
            disabled={selectedTokens.length !== 5}
            onClick={handleClick}
          >
            {page ? "Compete" : "Continue"}
          </Button>
        </Col>
      </Row>
      <Container fluid style={{ textAlign: "center" }}>
        <br />

        <br />
        {!page && showCards()}
        {page && confirmCards()}
        <br />
      </Container>
    </>
  );
}

export default Play;
