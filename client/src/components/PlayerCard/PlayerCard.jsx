import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Paper, Grid } from "@material-ui/core";
import { getBigMap } from "../../api/tzStatsApi";
import { playersBigmap, tokensBigmap } from "../../constants/contract";
import { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import { getPlayerMetadata, cricApifunction } from "../../api/playerMetadata";
import { getPlayerType } from "../../utils/players";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "32rem",
    height: "16rem",
    margin: "1rem",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    flex: 0.6,
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    flex: 0.4,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function PlayerCard(props) {
  const classes = useStyles();
  const { data } = props;
  const [tokenDetails, setTokenDetails] = useState();
  const [playerDetails, setPlayerDetails] = useState();
  const [playerExtraDetails, setPlayerExtraDetails] = useState();

  const fetchTokenDetails = async () => {
    const allTokens = await getBigMap(tokensBigmap);
    const token = allTokens[data.key];
    setTokenDetails(token);
  };

  const fetchPlayerDetails = async () => {
    if (tokenDetails) {
      const allPlayers = await getBigMap(playersBigmap);
      const player = allPlayers[tokenDetails.value.player_id];
      setPlayerDetails(player);
    }
  };

  const fetchPlayerMetaData = async () => {
    if (playerDetails) {
      setPlayerExtraDetails(
        await getPlayerMetadata(playerDetails.value.metadata)
      );
    }
  };

  useEffect(() => {
    fetchTokenDetails();
    cricApifunction();
  }, []);

  useEffect(() => {
    fetchPlayerDetails();
  }, [tokenDetails]);

  useEffect(() => {
    fetchPlayerMetaData();
  }, [playerDetails]);

  return (
    <Grid item xs={6}>
      <Card className={classes.root} variant={"outlined"}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {playerExtraDetails ? (
                playerExtraDetails.data.player.full_name
              ) : (
                <Skeleton variant="text" height={30} />
              )}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {playerExtraDetails ? (
                getPlayerType(playerExtraDetails.data.player.identified_roles)
              ) : (
                <Skeleton variant="text" height={30} />
              )}
            </Typography>
          </CardContent>
        </div>
        <CardMedia
          className={classes.cover}
          image="https://material-ui.com/static/images/cards/live-from-space.jpg"
          title="Live from space album cover"
        />
      </Card>
    </Grid>
  );
}
