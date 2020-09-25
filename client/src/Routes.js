import React, { lazy } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import BuyCards from "./pages/BuyCards";

const AddPlayer = lazy(() => import("./pages/AddPlayer"));
const CardDetails = lazy(() => import("./pages/CardDetails"));
const Match = lazy(() => import("./pages/Match"));
const MintToken = lazy(() => import("./pages/MintToken"));
const Notifications = lazy(() => import("./pages/Notifications"));
const OwnedCards = lazy(() => import("./pages/OwnedCards"));
const Play = lazy(() => import("./pages/Play"));
const PlayerDetails = lazy(() => import("./pages/PlayerDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const Search = lazy(() => import("./pages/Search"));
const SellCards = lazy(() => import("./pages/SellCards"));

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
