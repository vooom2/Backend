const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const riderModel = require("../models/riderModel");
const adminModel = require("../models/adminModel");

async function accountLoginFunction(accountType, email, password) {
  if (!email || email === "")
    throw { statusCode: 400, ok: false, message: "email is required" };

  if (!password || password === "")
    throw {
      errorCoe: 400,
      ok: false,
      message: "password is required",
    };
  console.log(`accountLoginFunction(${accountType}, ${email}, ${password})`);
  try {
    let userProfile;

    if (accountType === "owner") {
      userProfile = await vehicleOwnerModel.findOne({
        email: { $regex: new RegExp(email, "i") },
      });
    }
    if (accountType === "rider") {
      userProfile = await riderModel.findOne({
        email: { $regex: new RegExp(email, "i") },
      });
    }
    if (accountType === "admin") {
      userProfile = await adminModel.findOne({
        email: { $regex: new RegExp(email, "i") },
      });
    }

    // console.log({ userProfile });

    if (!userProfile)
      throw {
        statusCode: 404,
        ok: false,
        message: "Account Not Found",
      };
    if (userProfile.deleted === true)
      throw {
        statusCode: 404,
        ok: false,
        message: "Account has been deleted",
      };
    const validPassword = await bcrypt.compare(password, userProfile.password);

    if (!validPassword) {
      throw {
        statusCode: 400,
        ok: false,
        message: "Invalid login Parameter",
      };
    }
    const token = await jwt.sign(
      {
        uId: userProfile._id,
        accountType: userProfile.account_type,
      },
      process.env.JWT_SECRET, { expiresIn: "24h" }
    );
    if (userProfile.account_active !== true) {
      throw {
        statusCode: 401,
        ok: false,
        message: "Account has been deactivated contact an admin",
      };
    }
    userProfile.password = null;
    return { okay: true, token: token, profile: userProfile };
  } catch (error) {
    console.log(error);

    throw {
      statusCode: error.statusCode || 500,
      ok: false,
      message: error.message,
      error: "Error logging in",
    };
  }
}

// async function get

module.exports = {
  accountLoginFunction,
};
