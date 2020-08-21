import React, { useEffect, useState } from "react";
import { getContractStorage, getBigMap } from "../../api/tzStatsApi";
import { contractAddress, tokensOnSaleBigmap } from "../../constants/contract";
import PlayerCard from "../PlayerCard/PlayerCard";
import { Grid, makeStyles, Paper, Container } from "@material-ui/core";
import { tokensForSale } from "../../utils/dummyData";

function BuyCards(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: "1rem",
      marginBottom: "1rem",
    },
  }));

  const [contractStorage, setContractStorage] = useState({});
  const [tokens, setTokens] = useState([]);
  const classes = useStyles();

  const fetchContractStorage = async () => {
    setContractStorage(await getContractStorage(contractAddress));
  };

  const fetchTokensOnSale = async () => {
    setTokens(await getBigMap(tokensOnSaleBigmap));
  };

  useEffect(() => {
    fetchContractStorage();
    fetchTokensOnSale();
    setTokens(tokens);
  }, []);

  return (
    <Container className={classes.root}>
      <Grid container>
        {tokens.map((token, index) => (
          <PlayerCard key={index} data={token} />
        ))}
      </Grid>
    </Container>
  );
}

export default BuyCards;
