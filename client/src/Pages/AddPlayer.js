import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import {
  fetchPlayerbyName,
  getPlayersBigmapLength
} from "../api/playerMetadata";
import PageHeading from "../components/PageHeading/PageHeading";
import PlayerCardSm from "../components/PlayerCardSm/PlayerCardSm";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { useAuthContext } from "../context/auth/authContext";



function AddPlayer() {
  const [state, dispatch] = useAuthContext();
  const [loading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [metadata, setMetadata] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  const addPlayer = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Transaction Initiated");
    try {
      const playerId = await getPlayersBigmapLength();
      const operation = await state.contract.methods
        .addPlayer(state.userAddress, 1, metadata, playerName, playerId)
        .send();
      await operation.confirmation();
      alert("Transaction Completed");
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
      <PageHeading text="Add Players" />
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
                <Form.Label>Metdata String</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Metadata"
                  onChange={(e) => setMetadata(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !data || !metadata}
                onClick={addPlayer}
              >
                Add
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

export default AddPlayer;
