import React from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import PageHeading from "../components/PageHeading/PageHeading";
import RouteTransition from "../components/RouteTransition/RouteTransition";

function Search() {
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
