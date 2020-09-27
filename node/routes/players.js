const express = require("express");
const { isAdmin } = require("../middleware/controller");
const router = express.Router();
const {
  Player,
  validatePlayer,
  shortPlayer,
  playerPoints,
} = require("../models/player");
const { scrapePlayerPoints } = require("../util/updatePoints");

// GET ALL PLAYERS
router.get("/", async (req, res) => {
  try {
    const players = await Player.find()
      .select(shortPlayer)
      .sort({ player_id: 1 });
    res.status(200).send(players);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

// UPDATE ALL PLAYERS WITH POINTS ZERO
router.get("/updatepoints/all", async (req, res) => {
  try {
    const player = await Player.updateMany(
      {},
      { $set: { points: 0, rank: 10000 } }
    );
    res.status(200).send(player);
  } catch (err) {
    res.status(error.status).send(error.message);
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
    res.status(error.status).send(error.message);
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
    res.status(error.status).send(error.message);
  }
});

// ADD NEW PLAYER
router.post("/newplayer/", async (req, res) => {
  const result = false;
  if (result) {
    res.status(422).send(result.error.details[0].message);
  } else {
    try {
      const existsPlayer = await Player.findOne({
        player_id: req.body.player_id,
      });
      if (existsPlayer) {
        const temp1 = await existsPlayer.updateOne(req.body);
        res.status(200).send(temp1);
        return;
      }
      const player = new Player(req.body);
      const temp = await player.save();
      res.status(200).send(temp);
    } catch (error) {
      console.log("Failed");
      res.status(res.status).send(error.message);
    }
  }
});

// UPDATE PLAYER DETAILS
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const result = validatePlayer(req.body);
  if (result.error) {
    return res.status(422).send(result.error.details[0].message);
  }
  try {
    const player = await Player.findOne({ player_id: id });
    if (!player)
      return res.status(404).send(`Player with ID : ${id} does not exists`);
    let temp = await player.updateOne(req.body);
    temp = await player.save();
    console.log(id);
    res.status(200).send(temp);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE PLAYER
router.delete("/delete/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const player = await Player.findOne({ player_id: id });
    if (!player)
      return res.status(400).send(`Player with ID : ${id} does not exists`);
    let temp = await player.remove();
    res.status(200).send(temp);
  } catch (error) {
    res.status(400).send(error.message);
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
    res.status(res.status).send(error.message);
  }
});

//GET ALL PLAYERS WITH ID, RANK, POINTS
router.get("/getplayerpoints/all", async (req, res) => {
  try {
    let players = await Player.find().select(playerPoints);
    players = players.filter(
      (player) => player.rank !== null && player.points !== null
    );

    if (players === null) {
      res.status(404).send("Request Failed");
    } else {
      res.status(200).send(players);
    }
  } catch (error) {
    res.status(res.status).send(error.message);
  }
});

router.get("/scrape-player-points/all", async (req, res) => {
  try {
    const response = scrapePlayerPoints(
      "https://www.iplt20.com/stats/2020/player-points"
    );
    res.send(response.data);
  } catch (error) {
    res.status(res.status).send(error.message);
  }
});

module.exports = router;
