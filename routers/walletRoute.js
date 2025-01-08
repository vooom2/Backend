"use strict";
const Wallet = require("../models/walletModel");
// const Business = require("../models/businessModel");
// const PaymentRequest = require("../models/paymentRequestModel");
const WalletHistory = require("../models/walletHistoryModel");
// const bcrypt = require("bcrypt");
const walletRoute = require("express").Router();
// const { v4: uuidv4 } = require("uuid");
// const InstantWithdrawal = require("../models/instantWithdrawalModel");
// const { default: axios } = require("axios");
// const {
//   resolveAccount,
//   createRecipient,
//   initiateWithdrawal,
// } = require("./instantWithdrawalRoute");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");

walletRoute.get("/", async (req, res) => {
  const { userId, accountType } = res.locals;

  try {
    let wallet = await Wallet.findOne({ owner: userId }, "-pin -bank.pin");


    if (wallet == null) {
      return res.status(404).send({
        ok: false,
        message: "No wallet found",
      });
    }
    res.status(200).send({
      ok: true,
      wallet,
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Error getting wallet",
      error: error.message,
    });
  }
});
walletRoute.get("/history", async (req, res) => {
  const { userId, accountType } = res.locals;

  try {
    let query = {}
    if (accountType === "owner") {
      query = { owner: userId }
    }
    let history = await WalletHistory.find(query).sort({ createdAt: -1 });
    if (history == null) {
      return res.status(404).send({
        ok: false,
        message: "No history found",
      });
    }
    res.status(200).send({
      ok: true,
      history,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting wallet",
      error: error.message,
    });
  }
});

walletRoute.post("/set-pin", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { pin } = req.body;
  if (accountType !== "owner") {
    console.log(accountType);
    return res.status(401).send({
      ok: true,
      message: "Account is UnAuthorized to create wallet",
    });
  }

  try {
    let wallet = await Wallet.findOne({ owner: userId });
    if (wallet == null) {
      return res.status(404).send({
        ok: false,
        message: "No wallet found",
      });
    }
    wallet.pin = pin;
    wallet = await wallet.save();
    res.status(200).send({
      ok: true,
      message: "Pin set successfully",
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Error setting pin",
      error: error.message,
    });
  }
}); 

module.exports = walletRoute;
