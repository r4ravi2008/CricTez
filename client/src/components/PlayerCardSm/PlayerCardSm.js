import React from "react";

function PlayerCardSm(props) {
  const data = props.data;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color : "white"
      }}
    >
      <img src={data.image_url} />
      <div className="info">
        <h2>{data.name}</h2>
        <h4>{data.role}</h4>
        <h4 className="text-muted">{data.team}</h4>
      </div>
    </div>
  );
}

export default PlayerCardSm;
