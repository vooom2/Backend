const express = require("express");
const riderRoute = express.Router();
const Joi = require("joi");
const { startComplaint } = require("../../controllers/complaintController");
// Example route to get rider profile
riderRoute.post("/complaints", async (req, res) => {
  const schema = Joi.object({
    category: Joi.string().valid("vehicle-accident").required(),
    date: Joi.date().iso().required(),
    time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    fleetManager: Joi.string().hex().length(24).required(),
    location: Joi.string().required(),
    detail: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).min(1).max(2).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ ok: false, message: error.details[0].message });
  }

  try {
    return startComplaint(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, message: "Error creating complaint" });
  }
});
module.exports = riderRoute;
