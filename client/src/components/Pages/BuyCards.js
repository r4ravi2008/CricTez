import React, { useEffect, useState } from "react";
import { getContractStorage, getBigMap } from "../../api/tzStatsApi";
import { contractAddress, tokensOnSaleBigmap } from "../../constants/contract";
import PlayerCard from "../PlayerCard/PlayerCard";
import { tokensForSale, playerData } from "../../utils/dummyData";
import CardDeck from 'react-bootstrap/CardDeck'
import Container from 'react-bootstrap/Container'
import { Row } from "react-bootstrap";

function BuyCards(props) {


  const [contractStorage, setContractStorage] = useState({});
  const [tokens, setTokens] = useState([]);

  const fetchContractStorage = async () => {
    setContractStorage(await getContractStorage(contractAddress));
  };

  const fetchTokensOnSale = async () => {
    setTokens(await getBigMap(tokensOnSaleBigmap));
  };

  // useEffect(() => {
  //   fetchContractStorage();
  //   fetchTokensOnSale();
  //   setTokens(tokens);
  // }, []);

  useEffect(() => {
    setTokens(playerData)
    console.log(playerData)
  })


  return (
    <Container style={{ textAlign: 'center' }}>
      {
        tokens.map((token, index) => (
          <PlayerCard key={index} data={token} />
        ))
      }
    </Container>
  );
}

export default BuyCards;
