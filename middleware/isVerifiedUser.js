const adminModel = require("../models/adminModel");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const riderModel = require("../models/riderModel");

const isVerifiedUser = async (req, res, next) => {
  try {
    const userModels = {
      admin: adminModel,
      owner: vehicleOwnerModel,
      rider: riderModel,
    };

    const { userId, accountType } = res.locals;

    const user = await userModels[accountType].findById(userId);

    if (!user || !user.account_verified) {
      return res.status(403).send({
        ok: false,
        message: "Account is not verified",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      ok: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const isUserType = (type) => async (req, res, next) => {
  try {
    const { accountType } = res.locals;
    if (type !== accountType) {
      return res.status(403).send({
        ok: false,
        message: "Account type is not allowed",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      ok: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  isVerifiedUser,
  isUserType,
};
