import React from "react";
import {
  Redirect, Route,
  Switch,
  useLocation
} from "react-router-dom";
import AddPlayer from "./pages/AddPlayer";
import BuyCards from "./pages/BuyCards";
import CardDetails from "./pages/CardDetails";
import Match from "./pages/Match";
import MintToken from "./pages/MintToken";
import Notifications from "./pages/Notifications";
import OwnedCards from "./pages/OwnedCards";
import Play from "./pages/Play";
import PlayerDetails from "./pages/PlayerDetails";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import SellCards from "./pages/SellCards";


const Routes = () => {
  let location = useLocation();

  return (
    <Switch>
      <Route path="/" exact>
        <BuyCards />
      </Route>
      <Route path="/sell" exact>
        <SellCards />
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
      <Route path="/card/:id" exact>
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
      <Route path="/notifications" exact>
        <Notifications />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
