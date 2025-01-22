"use strict";
const jwt = require("jsonwebtoken");
// const Business = require("../../model/businessModel");
// const User = require("../../model/userModel");
// const Admin = require("../../model/adminModel");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const adminModel = require("../models/adminModel");
const riderModel = require("../models/riderModel");

async function jwtValidator(req, res, next) {
  const token = req.headers.authorization;
  if (!token || token === "") {
    console.log({
      token,
      message: "unAuthorized User",
      error: "empty token || invalid token",
    });
    return res.status(401).send({
      ok: false,
      message: "unAuthorized User",
      error: "empty token || invalid token",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { uId, accountType } = decode;


    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decode.exp < currentTime) {
      return res.status(401).send({
        ok: false,
        message: "Token is expired.",
      });
    }

    const userModels = {
      admin: adminModel,
      owner: vehicleOwnerModel,
      rider: riderModel,
    };

    const user = await userModels[accountType].findById(uId);

    if (!user) {
      return res.status(400).send({
        ok: false,
        message: "Account with this token does not exist",
      });
    }

    res.locals = {
      ...res.locals,
      userId: uId,
      accountType,
      account_verified: user.account_verified,
      email: user.email,
      full_name: user.full_name,
    };
    next();
  } catch (error) {

    // Handle token-specific errors (like expiration) separately
    if (error.name === "TokenExpiredError") {
      return res.status(403).send({
        ok: false,
        message: "Token has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({
        ok: false,
        message: "Invalid token. Please provide a valid token.",
      });
    }

    // Handle all other errors
    console.error("JWT validation error:", error);
    res.status(500).send({
      ok: false,
      message: "Internal server error during token validation.",
    });
  }
}

function checkAccess(req, res, next) {
  const { userId, accountType } = res.locals;
  if (
    !accountType ||
    accountType === null ||
    accountType === undefined ||
    !userId ||
    userId === null ||
    userId === undefined
  )
    return res.status(401).send({ ok: false, message: "Access key not found" });
  next();
}

function checkAccessOnlyOwner(req, res, next) {
  const { userId, accountType } = res.locals;

  if (accountType !== "owner") {
    return res.status(401).send({
      ok: false,
      message: "Account Type is not Authorized to make this request",
    });
  }
  next();
}

module.exports = { jwtValidator, checkAccess, checkAccessOnlyOwner };
