import React from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
  useLocation,
} from "react-router-dom";
import BuyCards from "./pages/BuyCards";
import SellCards from "./pages/SellCards";
import OwnedCards from "./pages/OwnedCards";
import Play from "./pages/Play";
import Profile from "./pages/Profile";
import PlayerDetails from "./pages/PlayerDetails";
import CardDetails from "./pages/CardDetails";
import SellCardDetails from "./pages/SellCardDetails.jsx";
import AddPlayer from "./pages/AddPlayer";
import MintToken from "./pages/MintToken";
import Match from "./pages/Match";
import Search from "./pages/Search";
import { AnimatePresence } from "framer-motion";

const Routes = () => {
  let location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter initial={true}>
      <Switch location={location} key={location.key}>
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
        <Redirect to="/" />
      </Switch>
    </AnimatePresence>
  );
};

export default Routes;
