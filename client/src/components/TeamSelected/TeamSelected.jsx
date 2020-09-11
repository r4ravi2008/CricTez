import React from "react";
import SelectPlayerCard from "../SelectPlayerCard/SelectPlayerCard";
import "./TeamSelected.css";

function TeamSelected({ batsman }) {
  console.log(batsman);
  return (
    <>
      <div
        className="wrapper-light wrapper-small-dark"
        style={{ color: "white" }}
      >
        {batsman ? (
          <>
            <SelectPlayerCard
              key={1}
              data={{ key: batsman.token_id }}
              owned={true}
            />
            <SelectPlayerCard
              key={1}
              data={{ key: batsman.token_id }}
              owned={true}
            />
            <SelectPlayerCard
              key={1}
              data={{ key: batsman.token_id }}
              owned={true}
            />
            <SelectPlayerCard
              key={1}
              data={{ key: batsman.token_id }}
              owned={true}
            />
            <SelectPlayerCard
              key={1}
              data={{ key: batsman.token_id }}
              owned={true}
            />
          </>
        ) : (
          "Select Batsman"
        )}
      </div>
      <br />
      <br />
    </>
  );
}

export default TeamSelected;
