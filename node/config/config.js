require("dotenv").config();

var options = {
  mongodb: process.env.MONGODB_URL,
};
module.exports = {
  options,
};
