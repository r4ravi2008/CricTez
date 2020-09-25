import React from "react";
import Button from "react-bootstrap/Button";
import { teams } from "../../constants/teams";
import { useAuthContext } from "../../context/auth/authContext";
import "./MatchCard.css";

function MatchCard(props) {
  const { data } = props;
  const [state] = useAuthContext();

  const activateMatchTx = async () => {
    try {
      const operation = await state.contract.methods
        .activateMatch(new Date(), data.key)
        .send();
      await operation.confirmation();
      alert("Transaction Completed");
    } catch (error) {
      alert(error.message);
    }
  };
  const endMatchTx = async () => {
    try {
      const operation = await state.contract.methods.endMatch(data.key).send();
      await operation.confirmation();
      alert("Transaction Completed");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="match-card">
      <div className="match-team">
        <div>{teams[data.teamA]}</div>
        <div className="team-image-container">
          <img
            src={`http://tranquil-earth-81896.herokuapp.com/teams/${data.teamA}-logo.png`}
          />
        </div>
      </div>
      <div className="match-versus">vs</div>
      <div className="match-team">
        <div className="team-image-container">
          <img
            src={`http://tranquil-earth-81896.herokuapp.com/teams/${data.teamA}-logo.png`}
          />
        </div>
        <div>{teams[data.teamB]}</div>
      </div>
      <div className="match-team">{data.date}</div>
      {props.admin ? (
        <div className="match-team">
          <Button onClick={data.active ? endMatchTx : activateMatchTx}>
            {data.active ? "End" : "Activate"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default MatchCard;
