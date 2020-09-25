const express = require("express");
const { isAdmin } = require("../middleware/controller");
const router = express.Router();
const axios = require("axios");

// GET ALL MATCHES
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.carthagenet.tzstats.com/explorer/contract/${process.env.CONTRACT_ADDRESS}/storage`
    );
    let matchesObj = response.data.value.matches || {};
    let matches = [];
    Object.keys(matchesObj).forEach((key) => {
      const match = matchesObj[key];
      matches.push({ key: key, ...match });
    });
    res.status(200).send(matches);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

module.exports = router;
