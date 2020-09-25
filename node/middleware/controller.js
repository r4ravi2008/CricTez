var jwt = require("jsonwebtoken");
var user = require("../models/user");

isAuthenticated = async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: true, token: null });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: true, token: null });
    }
    var payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload) {
      return res.status(401).json({ error: true, token: null });
    }
    req.token = token;
  } catch (err) {
    res.status(401).send({ error: true, message: err.message });
  }
  next();
};

isAdmin = async function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Header does not  exists", token: null });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token Not available", token: null });
  }
  var payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!payload) {
    return res.status(401).json({ error: "Incorrect Token", token: null });
  }
  req.payload = payload;
  user.findOne({ google_id: req.payload.google_id }).then((user1) => {
    if (user1 && user1.admin) {
      req.user1 = {
        firstname: user1.firstname,
        lastname: user1.lastname,
        email: user1.email,
        admin: user1.admin,
      };
      req.token = token;
      next();
    } else {
      res.status(401).json({ error: "You are not an Admin" });
    }
  });
};
module.exports = {
  isAuthenticated,
  isAdmin,
};
