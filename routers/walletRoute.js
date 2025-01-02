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

walletRoute.put("/create", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { pin, bank } = req.body;
  if (accountType !== "owner") {
    console.log(accountType);
    return res.status(401).send({
      ok: true,
      message: "Account is UnAuthorized to create wallet",
    });
  }

  try {
    // check wallet for duplicate
    const wallet = await Wallet.findOne({
      owner: userId,
    });

    if (wallet !== null)
      return res.status(400).send({
        ok: false,
        message: "User wallet Already exist",
      });


    if (!pin || pin === "")
      return res.status(200).send({
        ok: false,
        message: "wallet Pin is required",
      });
    if (!bank || !bank.account_name || !bank.bank || !bank.account_number)
      return res.status(200).send({
        ok: false,
        message: "withdraw bank is required",
      });


    const createWallet = new Wallet({
      owner: userId,
      pin, bank
    });

    const newWallet = await createWallet.save();

    // if (wallet) {
    const updatedOwner = await vehicleOwnerModel.findOneAndUpdate(
      { _id: userId },
      { wallet: newWallet._id },
      { new: true }
    ).populate("wallet", "-pin -bank.pin");

    res.status(200).send({
      ok: true,
      updatedOwner,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error Creating Wallet",
      error: error.message,
    });
  }
});


walletRoute.put("/update", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { pin, bank } = req.body;
  if (accountType !== "owner") {
    console.log(accountType);
    return res.status(401).send({
      ok: true,
      message: "Account is UnAuthorized to create wallet",
    });
  }

  try {
    // check wallet for duplicate
    const wallet = await Wallet.findOne({
      owner: userId,
    });
    if (wallet === null)
      return res.status(404).send({
        ok: false,
        message: "User wallet do not  exist",
      });

//     // business wallet
//     let businessWallet = business.wallet;

    if (!pin || pin === "")
      return res.status(200).send({
        ok: false,
        message: "wallet Pin is required",
      });
    if (!bank || !bank.account_name || !bank.bank || !bank.account_number)
      return res.status(200).send({
        ok: false,
        message: "withdraw bank is required",
      });


    wallet.pin = pin

    wallet.bank = bank

    const updatedWallet = await wallet.save()

    res.status(200).send({
      ok: true,
      updatedWallet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error Creating Wallet",
      error: error.message,
    });
  }
});


module.exports = walletRoute;
