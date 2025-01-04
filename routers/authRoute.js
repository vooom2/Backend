"use strict";

const { accountLoginFunction } = require("../controllers/authController");
const adminModel = require("../models/adminModel");
const riderModel = require("../models/riderModel");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const { jwtValidator } = require("../middleware/jwt");

require("dotenv").config();
const userAuth = require("express").Router();

userAuth.post("/admin/register", async (req, res) => {
  let { token, phone_number, password, full_name } = req.body;

  const { adminId, email, accountType } = verifyInvitation(token);
  // return console.log({ email, phone_number, password, full_name });

  // console.log({ payload })
  if (!email || email === "")
    return res.status(400).send({
      okay: false,
      message: "fill the email felid",
    });
  if (!phone_number || phone_number === "")
    return res.status(400).send({
      okay: false,
      message: "fill the Phone Number felid",
    });
  if (!password || password === "")
    return res.status(400).send({
      okay: false,
      message: "fill the password felid",
    });

  const saltPassword = await bcrypt.genSalt(12);
  const securePassword = await bcrypt.hash(password, saltPassword);

  // console.log("securePassword", securePassword);
  try {
    // check email for duplicate
    const user = await adminModel.findOne({
      $or: [{ email: email }, { phone_number: phone_number }],
    });

    if (user !== null) {
      if (user.email === email) {
        return res.status(400).send({
          okay: false,
          message: "User Already exist with this Email",
        });
      }
      if (user.phone_number === phone_number) {
        return res.status(400).send({
          okay: false,
          message: "User Already exist with this Phone Number",
        });
      }
    }

    let userObject = {
      account_type: accountType,
      // account_type,
      full_name,
      email,
      phone_number,
      password: securePassword,
      invited_by: adminId,
      // invited_by: "6746d6e7a13a07708cdd0089",
    };
    // return res.send({ userObject });

    //   // Create new user without referral
    userObject = new adminModel({ ...userObject });

    // Save user
    const newUser = await userObject.save();

    if (newUser) {
      const loginAccount = await accountLoginFunction("admin", email, password);

      res.status(200).json(loginAccount);
    }

    // res.status(201).json({ okay: true });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).send({
      okay: false,
      message: error.error,
      error: error.message,
    });
  }

  // res.send(req.body);
});

userAuth.post("/admin/login", async (req, res) => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }
  const { email, password } = req.body;

  try {
    const loginResponce = await accountLoginFunction("admin", email, password);

    res.status(loginResponce.statusCode || 200).send(loginResponce);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).send({
      okay: false,
      message: error.message || "Error Logging in",
      error: error.error,
    });
  }
});

userAuth.post("/owner/register", async (req, res) => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    phone_number: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi
      .string()
      .min(6)
      .invalid("password123", "iloveyou", "nigeria", "123456", "12345")
      .messages({
        "string.invalid":
          "You have used a common password. Please use another password.",
        "string.min": "Password must be at least 6 characters long.",
      })
      .required(),
    full_name: joi.string().max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ okay: false, message: error.details[0].message });
  }

  let { email, phone_number, password, full_name } = req.body;
  // return console.log({ email, phone_number, password, full_name });

  const saltPassword = await bcrypt.genSalt(12);
  const securePassword = await bcrypt.hash(password, saltPassword);

  // console.log("securePassword", securePassword);
  try {
    // check email for duplicate
    const user = await vehicleOwnerModel.findOne({
      $or: [{ email: email }, { phone_number: phone_number }],
    });

    if (user) {
      if (user.email === email) {
        return res
          .status(409)
          .send({ okay: false, message: "Email already exists" });
      }

      if (user.phone_number === phone_number) {
        return res
          .status(409)
          .send({ okay: false, message: "Phone number already exists" });
      }
    }

    let userObject = {
      full_name,
      email,
      phone_number,
      password: securePassword,
    };
    // return res.send({ userObject });

    //   // Create new user without referral
    userObject = new vehicleOwnerModel({ ...userObject });

    // Save user
    const newUser = await userObject.save();

    if (newUser) {
      CREATE_WALLET_CONTROLLER();
      const loginAccount = await accountLoginFunction("owner", email, password);

      res.status(200).json(loginAccount);
    }

    // res.status(201).json({ okay: true });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).send({
      okay: false,
      message: error.error,
      error: error.message,
    });
  }

  // res.send(req.body);
});

userAuth.post("/rider/register", async (req, res) => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    phone_number: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi
      .string()
      .min(6)
      .invalid("password123", "iloveyou", "nigeria", "123456", "12345")
      .messages({
        "string.invalid":
          "You have used a common password. Please use another password.",
        "string.min": "Password must be at least 6 characters long.",
      })
      .required(),
    full_name: joi.string().max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }

  let { email, phone_number, password, full_name } = req.body;

  const saltPassword = await bcrypt.genSalt(12);
  const securePassword = await bcrypt.hash(password, saltPassword);

  try {
    // check email for duplicate
    const user = await riderModel.findOne({
      $or: [{ email: email }, { phone_number: phone_number }],
    });

    if (user !== null) {
      if (user.email === email) {
        return res.status(400).send({
          okay: false,
          message: "User Already exist with this Email",
        });
      }
      if (user.phone_number === phone_number) {
        return res.status(400).send({
          okay: false,
          message: "User Already exist with this Phone Number",
        });
      }
    }

    let userObject = {
      full_name,
      email,
      phone_number,
      password: securePassword,
    };

    //   // Create new user without referral
    userObject = new riderModel({ ...userObject });

    // return res.send({ userObject });

    // Save user
    const newUser = await userObject.save();

    if (newUser) {
      const loginAccount = await accountLoginFunction("rider", email, password);

      res.status(200).json(loginAccount);
    }

    // res.status(201).json({ okay: true });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).send({
      okay: false,
      message: error.error,
      error: error.message,
    });
  }

  // res.send(req.body);
});

userAuth.post("/login", async (req, res) => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }
  const { email, password } = req.body;

  try {
    const owner = await vehicleOwnerModel.findOne({ email });
    const rider = await riderModel.findOne({ email });

    // if (owner && rider) {
    //   return res.status(409).send({
    //     okay: false,
    //     message: "Email already exists in both owner and rider collection",
    //   });
    // }

    if (owner) {
      const tryLogin = await accountLoginFunction("owner", email, password);

      return res
        .status(tryLogin.statusCode || 200)
        .send({ ...tryLogin, userType: "owner" });
    }

    if (rider) {
      const tryLogin = await accountLoginFunction("rider", email, password);

      return res
        .status(tryLogin.statusCode || 200)
        .send({ ...tryLogin, userType: "rider" });
    }

    return res.status(404).send({
      okay: false,
      message: "User not found",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).send({
      okay: false,
      message: error.message || "Error checking email",
      error: error.error,
    });
  }
});

userAuth.put("/change-password", jwtValidator, async (req, res) => {
  const schema = joi.object().keys({
    oldPassword: joi.string().min(6).required(),
    newPassword: joi
      .string()
      .min(6)
      .invalid("password123", "iloveyou", "nigeria", "123456", "12345")
      .messages({
        "string.invalid":
          "You have used a common password. Please use another password.",
        "string.min": "Password must be at least 6 characters long.",
      })
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }

  const { oldPassword, newPassword } = req.body;
  const { userId, accountType } = res.locals;

  try {
    let user;
    if (accountType === "rider") {
      user = await riderModel.findById(userId);
    } else if (accountType === "owner") {
      user = await vehicleOwnerModel.findById(userId);
    } else if (accountType === "admin") {
      user = await adminModel.findById(userId);
    }

    if (!user) {
      return res.status(404).send({
        okay: false,
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).send({
        okay: false,
        message: "Incorrect old password",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send({
      okay: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).send({
      okay: false,
      message: error.message || "Error changing password",
      error: error.error,
    });
  }
});






module.exports = userAuth;

const verifyInvitation = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    throw {
      okay: false,
      message: "Invalid or expired invitation token"
    }
    return null;
  }
};
