import React, { useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import {
  fetchPlayerbyName,
  getPlayersBigmapLength,
  getTokensBigmapLength,
} from "../api/playerMetadata";
import { useAuthContext } from "../context/auth/authContext";
import PlayerCardSm from "../components/PlayerCardSm/PlayerCardSm";
import PageHeading from "../components/PageHeading/PageHeading";

function MintToken() {
  const [state, dispacth] = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [address, setAddress] = useState("");
  const [playerID, setPlayerID] = useState(null);
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  const mintToken = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Transaction Initiated");
    try {
      const token_id = await getTokensBigmapLength();
      console.log(address, playerID, token_id);
      const operation = await state.contract.methods
        .mint(address, playerID, token_id)
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
    console.log(player);
  };

  return (
    <>
      <PageHeading text="Mint Tokens" />

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
                onChange={(e) => setPlayerID(e.target.value)}
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
              disabled={loading || !data || !playerID}
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
    </>
  );
}

export default MintToken;
