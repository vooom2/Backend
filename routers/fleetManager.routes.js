const express = require("express");
const fleetManagerModel = require("../models/fleetManagerModel");
const { getFMByState } = require("../controllers/fleetManagerController");
const {
  jwtValidator,
  isVerifiedUser,
  isUserType,
} = require("../middleware/jwt");
const { get } = require("mongoose");

const fmRoute = express.Router();

fmRoute.get("/", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const fleetManagers = await fleetManagerModel.paginate(
      {},
      {
        page,
        limit,
        sort: { createdAt: -1 },
      }
    );
    res.status(200).send({
      ok: true,
      ...fleetManagers,
    });
  } catch (error) {
    next(error);
  }
});

fmRoute.get("/state/:state", async (req, res, next) => {
  try {
    const fleetManagers = await getFMByState(req.params.state, req.query);
    return res.status(200).send({
      ok: true,
      fleetManagers,
    });
  } catch (error) {
    next(error);
  }
});

fmRoute.get("/:id", async (req, res, next) => {
  try {
    const fleetManager = await fleetManagerModel.findById(req.params.id);
    if (!fleetManager) {
      return res.status(404).send({
        ok: false,
        message: "Fleet Manager not found",
      });
    }
    res.status(200).send({
      ok: true,
      fleetManager,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = fmRoute;
