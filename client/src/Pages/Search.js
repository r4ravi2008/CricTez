import React from "react";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";

function Search() {
  return (
    <RouteTransition>
      <PageHeading text="Search Players/Cards" />
    </RouteTransition>
  );
}

export default Search;
