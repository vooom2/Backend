"use strict";

const { accountLoginFunction } = require("../controllers/authController");
const adminModel = require("../models/adminModel");
const riderModel = require("../models/riderModel");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const { jwtValidator } = require("../middleware/jwt");
const { CREATE_WALLET_CONTROLLER } = require("../controllers/WalletController");
const transport = require("../helpers/mail.helper");
const onboarding_template = require("../utils/tpl/onboard");
const { pw_reset_controller } = require("../controllers/authController");


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
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
      )
      .messages({
        "string.invalid":
          "You have used a common password. Please use another password.",
        "string.min": "Password must be at least 6 characters long.",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      })
      .required(),
    full_name: joi.string().max(100).required(),
    gender: joi.string().valid("male", "female").required(),

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
      return res
        .status(409)
        .send({ okay: false, message: "Email or phone number already exists" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    let userObject = {
      full_name,
      email,
      phone_number,
      password: securePassword,
      otp,
    };
    // return res.send({ userObject });

    //   // Create new user without referral
    userObject = new vehicleOwnerModel({ ...userObject });

    // Save user
    const newUser = await userObject.save();

    if (newUser) {
      CREATE_WALLET_CONTROLLER({ userId: newUser._id });
      const loginAccount = await accountLoginFunction("owner", email, password);

      transport.sendMail({
        from: "chida.codes@gmail.com",
        to: email,
        subject: "Verify your email",
        html: onboarding_template.owner({
          name: full_name, otp}),
      }, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

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
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
      )
      .messages({
        "string.invalid":
          "You have used a common password. Please use another password.",
        "string.min": "Password must be at least 6 characters long.",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      })
      .required(),
    full_name: joi.string().max(100).required(),
    gender: joi.string().valid("male", "female").required(),
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

    if (user) {
      return res
        .status(409)
        .send({ okay: false, message: "Email or phone number already exists" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    let userObject = {
      full_name,
      email,
      phone_number,
      password: securePassword,
      otp
    };

    //   // Create new user without referral
    userObject = new riderModel({ ...userObject });

    // return res.send({ userObject });

    // Save user
    const newUser = await userObject.save();

    if (newUser) {
      const loginAccount = await accountLoginFunction("rider", email, password);

     await  transport.sendMail({
        from: "chida.codes@gmail.com",
        to: email,
        subject: "Verify your email",
        html: onboarding_template.rider({
          name: full_name, otp: otp}),
      }, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });



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
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
      )
      .messages({
        "string.invalid":
          "You have used a common password. Please use another password.",
        "string.min": "Password must be at least 6 characters long.",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
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


userAuth.post("/pwreset",  async (req, res) => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }

  const { email } = req.body;

  try {
    const response  = await pw_reset_controller(email);

    if (!response.status) {
      return res.status(404).send({
        okay: false,
        message: response.message,
      });
    }

    return res.status(200).send({
      okay: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).send({
      okay: false,
      message: error.message || "Error sending password reset email",
      error: error.error,
    });
  }
});


userAuth.post("/pwreset-new", async (req, res) => {
  const schema = joi.object().keys({
    token: joi.string().required(),
    password: joi
      .string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
      )
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
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

  const { token, password } = req.body;
  console.log(token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const userModels = {
      owner: vehicleOwnerModel,
      rider: riderModel,
    };

    let user;
    for (const model of Object.values(userModels)) {
      user = await model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(404).send({
        okay: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({
      okay: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).send({
        okay: false,
        message: "Token is expired",
      });
    }
    console.log(error);
    res.status(error.statusCode || 500).send({
      okay: false,
      message: error.message || "Error resetting password",
      error: error.error,
    });
  }
});

userAuth.post("/verify-otp", async(req, res)=>{
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    otp: joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }

  const { email, otp } = req.body;

  try {
    const userModels = {
      owner: vehicleOwnerModel,
      rider: riderModel,
    };

    let user;
    for (const model of Object.values(userModels)) {
      user = await model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(404).send({
        okay: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      console.log(otp)
      return res.status(400).send({
        okay: false,
        message: "OTP is incorrect",
      });
    }

    user.otp = Math.floor(1000 + Math.random() * 9000);
    user.email_verified = true
    await user.save();

    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    

    res.status(200).send({
      okay: true,
      message: "Email verified successfully",
      profile: user.profile,
      user_type: user.account_type,
      token: user.token,
    });


  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).send({
      okay: false,
      message: error.message || "Error resetting OTP",
      error: error.error,
    });
  }
})






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
      message: "Invalid or expired invitation token",
    };
    return null;
  }
};
