"use strict";

const protectionPlanModel = require("../models/protectionPlanModel");

require("dotenv").config();
const protectionPlan = require("express").Router();

protectionPlan.get("/", async (req, res) => {
  const { plan_id } = req.query;
  try {
    // console.log({ plan_id });
    if (plan_id) {
      const plan = await protectionPlanModel.findOne({
        _id: plan_id,
      });
      if (!plan) {
        return res.status(404).send({
          okay: false,
          message: "No plan found with this ID",
        });
      }
      return res.status(200).send({
        okay: true,
        plan,
      });
    }
    const plans = await protectionPlanModel.find({ active: true });
    return res.status(200).send({
      okay: true,
      plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting protection plans",
      error: error.message,
    });
  }
});

protectionPlan.post("/", async (req, res) => {
  const { maintenance_charge, plans_detail, plans_benefits } = req.body;
  try {
    const newPlan = new protectionPlanModel({
      maintenance_charge,
      plans_detail,
      plans_benefits,
    });

    const savedPlan = await newPlan.save();
    return res.status(200).send({
      okay: true,
      plan: savedPlan,
      // plan: newPlan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting protection plans",
      error: error.message,
    });
  }
});

module.exports = protectionPlan;
