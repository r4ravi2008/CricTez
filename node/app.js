const express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cors = require("cors");
const playersRoute = require("./routes/players");
const storageRoute = require("./routes/storage");
require("./config/database");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/players", playersRoute);
app.use("/api/storage", storageRoute);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
