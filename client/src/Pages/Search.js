import React from "react";
import { useEffect } from "react";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { useAuthContext } from "../context/auth/authContext";
import { SET_NAVBAR_HEADING } from "../context/types";

function Search() {
  const [state, dispatch] = useAuthContext();

  useEffect(() => {
    dispatch({
      type: SET_NAVBAR_HEADING,
      payload: {
        heading: "Search",
      },
    });
  }, []);

  return (
    <RouteTransition>
      <PageHeading text="Search Players/Cards" />
    </RouteTransition>
  );
}

export default Search;
