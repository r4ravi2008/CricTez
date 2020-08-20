import React from "react";
import { Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import BuyCards from "./Pages/BuyCards";
import SellCards from "./Pages/SellCards";
import OwnedCards from "./Pages/OwnedCards";
import Play from "./Pages/Play";
import Profile from "./Pages/Profile";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact>
          <BuyCards />
        </Route>
        <Route path="/sell">
          <SellCards />
        </Route>
        <Route path="/buy">
          <OwnedCards />
        </Route>
        <Route path="/play">
          <Play />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default Routes;
