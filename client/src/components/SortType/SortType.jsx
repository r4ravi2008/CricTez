import React from "react";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./SortType.css";

function SortType(props) {
  const { tokens, setTokens } = props;

  function sort(sortProperty, arg) {
    let sorted;
    if (arg) {
      sorted = tokens.sort(
        (a, b) => b.value[sortProperty] - a.value[sortProperty]
      );
    } else {
      sorted = tokens.sort(
        (a, b) => a.value[sortProperty] - b.value[sortProperty]
      );
    }
    setTokens([...sorted]);
  }

  return (
    <Dropdown className="sort-dropdown">
      <Dropdown.Toggle id="dropdown-basic">Sort By</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => sort("price", 0)}>Price Up</Dropdown.Item>
        <Dropdown.Item onClick={() => sort("price", 1)}>
          Price Down
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SortType;
