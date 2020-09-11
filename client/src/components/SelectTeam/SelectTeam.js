import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { fetchOwnedTokens } from "../../api/playerMetadata";
import PlayerCard from "../PlayerCard/PlayerCard";
import { useAuthContext } from "../../context/auth/authContext";
import "./SelectTeam.css";
import SelectPlayerCard from "../SelectPlayerCard/SelectPlayerCard";
import TeamSelected from "../TeamSelected/TeamSelected";

function SelectTeam() {
  const [state, dispatch] = useAuthContext();
  const [tokens, setTokens] = useState([]);
  const [selected, setSelected] = useState(0);
  const [wicketKeeper, setWicketKeeper] = useState(null);
  const [batsman, setBatsman] = useState(null);
  const [bowler, setBowler] = useState(null);
  const [allRounder, setallRounder] = useState(null);
  const [otherPlayer, setOtherPlayer] = useState(null);

  useEffect(() => {
    if (state.userAddress)
      fetchOwnedTokens(state.userAddress).then((res) => setTokens(res));
  }, [state]);

  const roles = {
    0: "Other",
    1: "Bowler",
    2: "Wicket Keeper",
    3: "All-Rounder",
    5: "Batsman",
  };

  const RoleCards = (role) => {
    return !tokens.length ? (
      <h3>Players Warming Up...</h3>
    ) : (
      tokens.map((token, index) => (
        <SelectPlayerCard
          key={index}
          data={{ key: token }}
          owned={true}
          role={role}
          setWicketKeeper={setWicketKeeper}
          setBatsman={setBatsman}
          setBowler={setBowler}
          setallRounder={setallRounder}
          setOtherPlayer={setOtherPlayer}
        />
      ))
    );
  };

  return (
    <Container fluid style={{ textAlign: "center" }}>
      <TeamSelected
        wicketKeeper={wicketKeeper}
        batsman={batsman}
        bowler={bowler}
        allRounder={allRounder}
        otherPlayer={otherPlayer}
      />
      <RoleCards role={roles[selected]} />
    </Container>
  );
}

const selectedPlayers = () => {
  return;
};

export default SelectTeam;
