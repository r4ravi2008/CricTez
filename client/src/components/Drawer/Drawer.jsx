import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CardMembershipOutlinedIcon from "@material-ui/icons/CardMembershipOutlined";
import SportsCricketIcon from "@material-ui/icons/SportsCricket";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./Drawer.css";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  primaryText: {
    fontSize: "0.9rem",
    fontWeight: 500,
  },
});

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <br />
        <center>
          <Typography variant="h4">CricTez</Typography>
        </center>
        <br />
        <Divider />

        <ListItem
          button
          component={Link}
          to="/"
          className={clsx(classes.listItem)}
        >
          <ListItemIcon>
            <MonetizationOnIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText
            primary={"Marketplace"}
            classes={{ primary: classes.primaryText }}
          />
        </ListItem>

        <ListItem button component={Link} to="/sell">
          <ListItemIcon>
            <ShoppingCartIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText
            primary={"Sell Cards"}
            classes={{ primary: classes.primaryText }}
          />
        </ListItem>
        <ListItem button component={Link} to="/owned">
          <ListItemIcon>
            <CardMembershipOutlinedIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText
            primary={"Owned Cards"}
            classes={{ primary: classes.primaryText }}
          />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/play">
          <ListItemIcon>
            <SportsCricketIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText
            primary={"Play & Earn"}
            classes={{ primary: classes.primaryText }}
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <React.Fragment>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(anchor, true)}
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
