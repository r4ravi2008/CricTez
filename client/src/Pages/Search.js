import React from "react";
import { useEffect } from "react";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";
import { useAuthContext } from "../context/auth/authContext";
import { SET_NAVBAR_HEADING } from "../context/types";
import Container from "react-bootstrap/Container";
import { Form } from "react-bootstrap";

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
      <Container>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search"
            className="search-bar"
          />
        </Form.Group>
      </Container>
    </RouteTransition>
  );
}

export default Search;
