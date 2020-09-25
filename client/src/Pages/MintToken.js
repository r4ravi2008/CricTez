import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import {
  fetchPlayerbyName,
  getTokensBigmapLength
} from "../api/playerMetadata";
import PageHeading from "../components/PageHeading/PageHeading";
import PlayerCardSm from "../components/PlayerCardSm/PlayerCardSm";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { useAuthContext } from "../context/auth/authContext";

function MintToken() {
  const [state] = useAuthContext();
  const [loading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [address, setAddress] = useState("");
  const [playerID, setPlayerID] = useState(0);
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  const mintToken = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Transaction Initiated");
    try {
      const token_id = await getTokensBigmapLength();
      const operation = await state.contract.methods
        .mint(address, 1, playerID, token_id)
        .send();
      await operation.confirmation();
      console.log("Transaction Completed");
    } catch (error) {
      setError(error.message);
    }
  };

  const keyPressed = async (e) => {
    setData(null);
    setPlayerName(e.target.value);
    const player = await fetchPlayerbyName(e.target.value);
    if (player.name) {
      setData(player);
    }
  };

  return (
    <>
      <PageHeading text="Mint Tokens" />
      <RouteTransition>
        <Container>
          {error}
          <div className="addplayer__container">
            <Form className="from__addplayer">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Player Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  onChange={keyPressed}
                  value={playerName}
                />
                <Form.Text className="text-muted">
                  Make sure the player is in the database.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Player ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Player ID of Above Player"
                  onChange={(e) => setPlayerID(parseInt(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Reciever of Token"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={!data || !playerID}
                onClick={mintToken}
              >
                Mint
              </Button>
            </Form>
            <div className="addplayer__card">
              {data ? <PlayerCardSm data={data} /> : ""}
            </div>
          </div>
        </Container>
      </RouteTransition>
    </>
  );
}

export default MintToken;
