const express = require("express");
const router = express.Router();
const { Player, validatePlayer } = require("../models/player");

// GET ALL PLAYERS
router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).send(players);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET PLAYER DETAILS WITH PLAYER ID
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
    res.status(400).send(error);
  }
});

// ADD NEW PLAYER
router.post("/newplayer/", async (req, res) => {
  const result = validatePlayer(req.body);
  if (result.error) {
    console.log(result.error);
    res.status(400).send(result.error.details[0].message);
  } else {
    try {
      const player = new Player(req.body);
      const temp = await player.save();
      res.status(200).send(temp);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
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
    res.status(400).send(error);
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
    res.status(400).send(error);
  }
});

module.exports = router;
