const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const playerSchema = new mongoose.Schema({
  player_id: { type: String, unique: true },
  name: { type: String, unique: true },
  points: Number,
  rank: Number,
  team: String,
  role: String,
  batting_style: String,
  bowling_style: String,
  dob: String,
  bio: String,
  batting_stats: Array,
  bowling_stats: Array,
  image_url: String,
  matches: String,
  runs: String,
  wickets: String,
  nationality: String,
});
const Player = mongoose.model("Player", playerSchema);

const validatePlayer = (data) => {
  const schema = Joi.object({
    player_id: Joi.string(),
    name: Joi.string(),
    points: Joi.number(),
    rank: Joi.number(),
    team: Joi.string(),
    role: Joi.string(),
    batting_style: Joi.string(),
    bowling_style: Joi.string(),
    dob: Joi.string(),
    bio: Joi.string(),
    batting_stats: Joi.array(),
    bowling_stats: Joi.array(),
    image_url: Joi.string(),
    matches: Joi.string(),
    runs: Joi.string(),
    wickets: Joi.string(),
    nationality: Joi.string(),
  });

  return schema.validate(data);
};

const shortPlayer = {
  name: 1,
  image_url: 1,
  role: 1,
  matches: 1,
  runs: 1,
  wickets: 1,
  team: 1,
  player_id: 1,
};

const playerPoints = {
  player_id: 1,
  points: 1,
  rank: 1,
};
module.exports = {
  Player: Player,
  validatePlayer: validatePlayer,
  shortPlayer: shortPlayer,
  playerPoints: playerPoints,
};
