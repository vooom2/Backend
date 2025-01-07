/**
 * General user routes
 */
const adminModel = require("../models/adminModel");
const riderModel = require("../models/riderModel");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const userRoute = require("express").Router();
const verificationModel = require("../models/verificationModel");
const Joi = require("joi");

/**
 * Get user profile
 */
userRoute.get("/", async (req, res) => {
  const { userId, accountType } = res.locals;
  try {
    let profile;
    // riders
    if (accountType === "rider") {
      profile = await riderModel
        .findOne({ _id: userId }, "-password")
        .populate("vehicle");
    }
    // owners
    if (accountType === "owner") {
      profile = await vehicleOwnerModel
        .findOne({ _id: userId }, "-password")
        .populate("wallet", "-pin -bank.pin");
    }
    // admins
    if (
      accountType === "admin" ||
      accountType === "manger" ||
      accountType === "compliance" ||
      accountType === "accountant"
    ) {
      profile = await adminModel.findOne({ _id: userId }, "-password");
    }
    if (!profile)
      return res.status(404).send({ ok: false, message: "profile not found" });
    return res.send({ ok: true, profile });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error getting profile",
      error: `${error.message}`,
    });
  }
});

/**
 * Update user profile
 */
userRoute.put("/", async (req, res) => {
  const { userId, accountType } = res.locals;
  const profileUpdate = req.body;
  try {
    let newProfileUpdate;
    // riders
    if (accountType === "rider") {
      newProfileUpdate = await riderModel.updateOne(
        { _id: userId },
        profileUpdate
      );
    }
    // owners
    if (accountType === "owner") {
      newProfileUpdate = await vehicleOwnerModel.updateOne(
        { _id: userId },
        { $set: profileUpdate }
      );
    }
    // admins
    if (
      accountType === "admin" ||
      accountType === "manger" ||
      accountType === "compliance" ||
      accountType === "accountant"
    ) {
      newProfileUpdate = await adminModel.updateOne(
        { _id: userId },
        profileUpdate
      );
    }
    if (!newProfileUpdate.acknowledged) {
      return res
        .status(404)
        .send({ ok: false, message: "Profile was not updated" });
    }
    return res.send({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error updating profile",
      error: `${error.message}`,
    });
  }
});

/**
 * Update user verification details
 */
userRoute.post("/get-verified", async (req, res) => {
  const schema = Joi.object({
    primaryID: Joi.string().required(),
    secondaryID: Joi.string(),
    guarantor_documents: Joi.object({
      full_name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.number().required(),
      organization: Joi.string(),
      location: Joi.string(),
      gender: Joi.string(),
      verified: Joi.boolean().default(false),
      state: Joi.string(),
      address: Joi.string(),
      img: Joi.string(),
      workID: Joi.string(),
      primaryID: Joi.string().required(),
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }
  const { primaryID, secondaryID, guarantor_documents } = req.body;
  const { userId, accountType } = res.locals;
  try {
    const userVerification = await verificationModel.findOne({ user: userId });
    if (userVerification) {
      await verificationModel.updateOne(
        { user: userId },
        { $set: { primaryID, secondaryID, guarantor_documents } }
      );
    } else {
      await verificationModel.create({
        user: userId,
        primaryID,
        secondaryID,
        guarantor_documents,
      });
    }

    if (accountType === "rider") {
      await riderModel.updateOne(
        { _id: userId },
        { $set: { verification_started: true } }
      );
    }
    if (accountType === "owner") {
      await vehicleOwnerModel.updateOne(
        { _id: userId },
        { $set: { verification_started: true } }
      );
    }

    return res.send({ ok: true, message: "Verification updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error updating profile",
      error: `${error.message}`,
    });
  }
  return res.send({ ok: true });
});

// owner action routes
userRoute.use("/owner", require("./owner/owner.routes"));

// rider action routes
userRoute.use("/rider", require("./rider/rider.routes"));

module.exports = userRoute;
