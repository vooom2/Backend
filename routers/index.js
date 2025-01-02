const routers = require("express").Router();
const { jwtValidator } = require("../middleware/jwt.js");

routers.get("/", (req, res) => {
  res.json({ message: "Server is working fine with the new direct push" });
});

module.exports = routers;
