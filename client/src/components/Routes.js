import React from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import BuyCards from "./Pages/BuyCards";
import SellCards from "./Pages/SellCards";
import OwnedCards from "./Pages/OwnedCards";
import Play from "./Pages/Play";
import Profile from "./Pages/Profile";
import PlayerDetails from "./Pages/PlayerDetails";
import CardDetails from "./Pages/CardDetails";
import SellCardDetails from "./Pages/SellCardDetails.jsx";
import AddPlayer from "./Pages/AddPlayer";
import MintToken from "./Pages/MintToken";
import Match from "./Pages/Match";
import Search from "./Pages/Search";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact>
          <BuyCards />
        </Route>
        <Route path="/sell" exact>
          <SellCards />
        </Route>
        <Route path="/sell/token" exact>
          <SellCardDetails />
        </Route>
        <Route path="/owned">
          <OwnedCards />
        </Route>
        <Route path="/play">
          <Play />
        </Route>
        <Route path="/search" exact>
          <Search />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/player/:id">
          <PlayerDetails />
        </Route>
        <Route path="/card/:id">
          <CardDetails />
        </Route>
        <Route path="/addplayer" exact>
          <AddPlayer />
        </Route>
        <Route path="/minttoken" exact>
          <MintToken />
        </Route>
        <Route path="/matches" exact>
          <Match />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default Routes;
