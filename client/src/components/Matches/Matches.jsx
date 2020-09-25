import React, { lazy, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Dropdown from "react-bootstrap/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import { getMatches } from "../../api/playerMetadata";
import { teams } from "../../constants/teams";
import { useAuthContext } from "../../context/auth/authContext";
import MatchCard from "../MatchCard/MatchCard";
import PageHeading from "../PageHeading/PageHeading";
import "./Matches.css";
const DatePicker = lazy(() => import("react-datepicker"));

function Matches(props) {
  const [page, setPage] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PageHeading text={page ? "Add Match" : "Activate Match"}>
        <Container>
          <Button onClick={() => (page ? setPage(0) : setPage(1))}>
            Switch to {page ? "Activate Match" : "Add Match"}
          </Button>
        </Container>
      </PageHeading>
      <Container>
        <br />
        <br />
        {page ? <AddMatch /> : <ActivateMatch />}
      </Container>
    </div>
  );
}

const AddMatch = () => {
  const teamsArray = [];
  Object.keys(teams).forEach((key) =>
    teamsArray.push({ key: key, name: teams[key] })
  );
  console.log(teamsArray);
  const [optionteams, setOptionsteams] = useState(teamsArray);
  const [teamA, setTeamA] = useState({});
  const [teamB, setTeamB] = useState({});
  const [date, setDate] = useState(new Date());
  const [state] = useAuthContext();

  const addMatchTx = async () => {
    const match_id = new Date().getUTCMilliseconds();
    try {
      const operation = await state.contract.methods
        .addMatch(
          date.toDateString(),
          match_id,
          teamA.key.toString(),
          teamB.key.toString()
        )
        .send();
      await operation.confirmation();
      alert("Transaction Completed");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Row style={{ textAlign: "center" }}>
      <Col>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">
            {teamA.name ? teamA.name : "Select Team A"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {optionteams.map((team) => (
              <Dropdown.Item key={team.key} onClick={() => setTeamA(team)}>
                {team.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">
            {teamB.name ? teamB.name : "Select Team B"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {optionteams.map((team) => (
              <Dropdown.Item key={team.key} onClick={() => setTeamB(team)}>
                {team.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col>
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      </Col>
      <Col>
        <Button disabled={!teamA.name || !teamB.name} onClick={addMatchTx}>
          Add
        </Button>
      </Col>
    </Row>
  );
};

const ActivateMatch = () => {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    getMatches().then((res) => {
      res = res.filter((item) => !item.finished);
      setMatches(res);
    });
  }, []);

  return (
    <div>
      {matches.map((match) => (
        <MatchCard key={match.key} data={match} admin />
      ))}
    </div>
  );
};

export default Matches;
