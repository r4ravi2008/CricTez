const express = require("express");
const router = express.Router();
const { Player, validatePlayer, shortPlayer } = require("../models/player");

// GET ALL PLAYERS
router.get("/", async (req, res) => {
  try {
    const players = await Player.find()
      .select(shortPlayer)
      .sort({ player_id: 1 });
    res.status(200).send(players);
  } catch (error) {
    res.status(400).send(error.message[0]);
  }
});

// UPDATE ALL PLAYERS WITH POINTS ZERO
router.get("/updatepoints/all", async (req, res) => {
  try {
    const player = await Player.updateMany(
      {},
      { $set: { points: 0, rank: 10000 } }
    );
    res.send(player);
  } catch (err) {
    res.status(error.status).send(error);
  }
});

// GET PLAYER WITH PLAYER ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const player = await Player.findOne({ player_id: id }).select(shortPlayer);

    if (player === null) {
      res.status(404).send("Invalid Player ID");
    } else {
      res.status(200).send(player);
    }
  } catch (error) {
    res.status(400).send(error.message[0]);
  }
});

// GET COMPLETE PLAYER DETAILS WITH PLAYER ID
router.get("/playerdetails/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const player = await Player.findOne({ player_id: id });
    if (player === null) {
      res.status(404).send("Invalid Player ID");
    } else {
      res.status(200).send(player);
    }
  } catch (error) {
    res.status(400).send(error.message[0]);
  }
});

// ADD NEW PLAYER
router.post("/newplayer/", async (req, res) => {
  const result = validatePlayer(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {
    try {
      const player = new Player(req.body);
      const temp = await player.save();
      res.status(200).send(temp);
    } catch (error) {
      res.status(400).send(error.message[0]);
    }
  }
});

// UPDATE PLAYER DETAILS
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const result = validatePlayer(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  try {
    const player = await Player.findOne({ player_id: id });
    if (!player)
      return res.status(400).send(`Player with ID : ${id} does not exists`);
    let temp = await player.updateOne(req.body);
    temp = await player.save();
    res.status(200).send(temp);
  } catch (error) {
    res.status(400).send(error.message[0]);
  }
});

// DELETE PLAYER
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const player = await Player.findOne({ player_id: id });
    if (!player)
      return res.status(400).send(`Player with ID : ${id} does not exists`);
    let temp = await player.remove();
    res.status(200).send(temp);
  } catch (error) {
    res.status(400).send(error.message[0]);
  }
});

// GET PLAYER WITH NAME
router.post("/name/", async (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(503).send("Provide Player Name");
  try {
    const player = await Player.findOne({ name: name });
    if (player === null) {
      res.status(200).send({});
    } else {
      res.status(200).send(player);
    }
  } catch (error) {
    res.status(400).send(error.message[0]);
  }
});

module.exports = router;
