const express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cors = require("cors");
const playersRoute = require("./routes/players");
require("./config/database");

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/players", playersRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
