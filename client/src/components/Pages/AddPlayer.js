import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import PlayerCard from "../PlayerCard/PlayerCard";
import {
  fetchPlayerbyName,
  getPlayersBigmapLength,
} from "../../api/playerMetadata";
import { useAuthContext } from "../../context/auth/authContext";

function AddPlayer() {
  const [state, dispacth] = useAuthContext();
  const [loading, setLoading] = useState(false);
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
        .addPlayer(1, metadata, playerName, playerId)
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
      console.log(player);
      setData(player);
    }
  };

  return (
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
          {data ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={data.image_url} />
              <div className="info">
                <h2>{data.name}</h2>
                <h4>{data.role}</h4>
                <h4 className="text-muted">{data.team}</h4>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Container>
  );
}

export default AddPlayer;
