const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ google_id: req.body.googleId });

    if (user) {
      const payload = {
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        google_id: user.google_id,
        admin: user.admin,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      res.json({
        error: false,
        token,
        user: {
          ...payload,
        },
      });
    } else {
      const newUser = new User({
        name: req.body.profileObj.name,
        email: req.body.profileObj.email,
        imageUrl: req.body.profileObj.imageUrl,
        admin: false,
        google_id: req.body.googleId,
      });
      await newUser.save();
      const payload = {
        admin: newUser.admin,
        name: newUser.name,
        email: newUser.email,
        imageUrl: newUser.imageUrl,
        google_id: newUser.google_id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      res.json({
        error: false,
        token,
        user: {
          ...payload,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: error,
      msg: "Try Again",
    });
  }
});

module.exports = router;
