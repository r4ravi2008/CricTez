const express = require("express");
const router = express.Router();
const axios = require("axios");
const { Player, validatePlayer, shortPlayer } = require("../models/player");
const { isAuthenticated, isAdmin } = require("../middleware/controller");

// GET TOKEN ALONG WITH PLAYER DETAILS & FULL METADATA
router.get("/tokens/tokendetails/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const tokenResponse = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.ALL_TOKENS_BIGMAP}/values?limit=100`
    );
    const tokenData = tokenResponse.data[id].value;
    const tokenOnSaleResponse = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.TOKENS_FOR_SALE_BIGMAP}/values?limit=100`
    );
    let tokenOnSaleData = { sale: {} };
    const onSale = tokenOnSaleResponse.data.filter((item) => item.key === id);
    if (onSale.length) tokenOnSaleData.sale = onSale[0].value;
    const playerId = tokenResponse.data[id].value.player_id;
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.ALL_PLAYERS_BIGMAP}/values?limit=100`
    );
    const name = response.data[playerId].value.name;
    const player = await Player.findOne({ name: name });
    if (player === null) {
      res.status(404).send("Invalid Player Metadata");
    } else {
      res.status(200).send({
        ...tokenData,
        ...player._doc,
        ...tokenOnSaleData,
      });
    }
  } catch (error) {
    res.status(error.status).send(error.message[0]);
  }
});

// GET TOKEN DETAILS WITH ID
router.get("/tokens/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.ALL_TOKENS_BIGMAP}/values`
    );
    const bigmap = response.data;
    res.status(200).send(bigmap[id]);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

// GET PLAYER DETAILS WITH ID
router.get("/players/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.ALL_PLAYERS_BIGMAP}/values`
    );
    const bigmap = response.data;
    res.status(200).send(bigmap[id]);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

// GET OWNED TOKENS
router.get("/owned/:address", isAuthenticated, async (req, res) => {
  const address = req.params.address;
  try {
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.LEDGER_BIGMAP}/values`
    );

    const bigmap = response.data;
    const owned = bigmap.filter((item) => item.key === address);
    if (!owned.length) res.status(200).send("No Tokens");
    const ownedTokens = owned[0].value["0@set"];
    res.status(200).send(ownedTokens);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

// GET ALL TOKENS
router.get("/tokens", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.ALL_TOKENS_BIGMAP}/values`
    );
    const bigmap = response.data;
    res.status(200).send(bigmap);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//GET ALL PLAYERS
router.get("/players", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.ALL_PLAYERS_BIGMAP}/values`
    );
    const bigmap = response.data;
    res.status(200).send(bigmap);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

// GET ALL TOKENS ON SALE WITH ID
router.get("/tokensforsale", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/bigmap/${process.env.TOKENS_FOR_SALE_BIGMAP}/values`
    );
    const bigmap = response.data;
    res.status(200).send(bigmap);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});
// GET ALL TOKENS FOR SALE ALONG WITH PLAYER DETAILS & FULL METADATA

module.exports = router;
