"use strict";
require("./helpers/schedule.helper");
require("dotenv").config();
// require("./config/db");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const apiRoutes = require("./routers/api.routes");

const app = express();

mongoose.set("strictQuery", false);

app.use(bodyParser.json());

// Cors
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(helmet());

// Request  routes
app.use("/api", apiRoutes);

// Ping route FOR KEEPING THE SERVER ALIVE
app.get("/ping", (req, res) => {
  res.send("pong");
});



const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening to port ${port}...`);
      console.log("Connected to MongoDB");
    });
  })
  .catch((err) => console.log("Error->", err));

// Export the server
module.exports = app;
