import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import {
  fetchPlayerbyName,
  getPlayersBigmapLength,
} from "../api/playerMetadata";
import { useAuthContext } from "../context/auth/authContext";
import PlayerCardSm from "../components/PlayerCardSm/PlayerCardSm";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { useEffect } from "react";
import { SET_NAVBAR_HEADING } from "../context/types";

function AddPlayer() {
  const [state, dispatch] = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [metadata, setMetadata] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch({
      type: SET_NAVBAR_HEADING,
      payload: {
        heading: "Add Player",
      },
    });
  }, []);

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
