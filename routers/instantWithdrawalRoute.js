const crypto = require("crypto");
const instantWithdrawalRoute = require("express").Router();
const axios = require("axios");
const { log } = require("console");
const Wallet = require("../models/walletModel");
const { jwtValidator } = require("../middleware/jwt");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const walletHistoryModel = require("../models/walletHistoryModel");
const InstantWithdrawal = require("../models/instantWithdrawalModel");

const whitelistedIPs = [
  "52.31.139.75",
  "52.49.173.169",
  "52.214.14.220",
  "::ffff:10.1.12.192",
];

// Replace these with your actual Paystack API keys
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API_BASE_URL = "https://api.paystack.co";

async function getBankCodes() {
  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  };

  try {
    const response = await axios.get(
      `${PAYSTACK_API_BASE_URL}/bank?currency=NGN`,
      {
        headers,
      }
    );
    return response.data.data; // An array of bank objects with codes
  } catch (error) {
    console.error("Error fetching bank codes:", error.response.data);
    throw error;
  }
}

instantWithdrawalRoute.get("/banks", (req, res) => {
  // Example usage
  getBankCodes()
    .then((banks) => {
      // console.log("Bank codes:", banks);
      res.send({ okay: true, banks });
    })
    .catch((error) => {
      // Handle errors
      console.log("Error getting banks", error.message);
      res.send({
        okay: false,
        error: error.message,
        message: "Error getting bank",
      });
    });
});

instantWithdrawalRoute.get("/resolve-account", async (req, res) => {
  const { account_number, bank_code } = req.query;

  if (!account_number || account_number === "") {
    return res.send({
      okay: false,
      message: "account_number is required",
    });
  }
  if (!bank_code || bank_code === "") {
    return res.send({
      okay: false,
      message: "bank_code is required",
    });
  }

  try {
    let accountDetail = await resolveAccount(account_number, bank_code);

    res.send({
      okay: true,
      accountDetail,
    });
  } catch (error) {
    res.status(500).send({ okay: false, message: "Error Resolving Account" });
  }
});
instantWithdrawalRoute.get("/", jwtValidator, async (req, res) => {
  const { userId, accountType } = res.locals;

  if (accountType === "admin") {
    let instantPayout = await InstantWithdrawal.find({})
      .populate("owner", "full_name")

    return res.send({ ok: true, instantPayout });
  }
  let instantPayout = await InstantWithdrawal.find({
    business: userId,
  }).populate("owner", "full_name");

  return res.send({ ok: true, instantPayout });
  // res.send("paystack-api route");
});

instantWithdrawalRoute.post("/webhook", async (req, res) => {
  const requestIP = req.ip;
  //validate event
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  try {
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      const event = req.body;
      // Do something with event
      // return res.send(event);
      // Process the event here

      const { reference, status } = event.data;
      console.log("Received webhook event:", { reference, status });

      let paymentDoc = await InstantWithdrawal.findOne({
        paymentId: reference,
      });

      console.log("paymentDoc", paymentDoc);
      if (!paymentDoc) {
        return log(
          "Withdrawal document not found for payment reference:",
          reference
        );
      }
      if (event.event === "transfer.success") {
        log("Payment Successful");
      }
      if (event.event === "transfer.failed") {
        log("Payment failed");
      }
      if (event.event === "transfer.reversed") {
        log("Payment reversed");
      }

      let updatePayment = await InstantWithdrawal.findOneAndUpdate(
        {
          paymentId: reference,
        },
        {
          status,
        },
        { new: true }
      );

      console.log("updatePayment", updatePayment.paymentId);
      res.status(200).send("Webhook received");
      // if (whitelistedIPs.includes(requestIP)) {
      // } else {
      //   console.log("Unauthorized request from:", requestIP);
      //   res.status(403).send("Unauthorized request from:", requestIP);
      // }
    }
  } catch (error) {
    log({
      okay: false,
      message: "Error handling webhook",
      error,
    });
  }

  // res.send(200);
});

instantWithdrawalRoute.post("/", jwtValidator, async (req, res) => {
  const { userId, accountType } = res.locals;
  const { accountNumber, bankCode, requested_amount, pin } = req.body;

  console.log({
    route: "/payout",
  });

  if (
    !accountType ||
    accountType !== "owner"

  ) {
    console.log("No accountType", accountType);
    return res.status(400).send({
      ok: false,
      message: "Unauthorized Account making request",
    });
  }

  if (!userId || userId === "") {
    console.log("No userId");
    return res.status(400).send({ ok: false, message: "userId is required" });
  }

  if (!accountNumber || accountNumber === "") {
    console.log("No accountNumber");
    return res
      .status(400)
      .send({ ok: false, message: "Account Number is required" });
  }
  if (!bankCode || bankCode === "") {
    console.log("No bankCode");
    return res
      .status(400)
      .send({ ok: false, message: "Bank Name is required" });
  }
  if (!requested_amount || requested_amount === "") {
    console.log("No requested_amount");
    return res.status(400).send({ ok: false, message: "Amount is required" });
  }

  if (!pin || pin === "") {
    console.log("No pin");
    return res.status(400).send({
      ok: false,
      message: "Pin is empty",
    });
  }
  try {
    let
      account = await vehicleOwnerModel.findOne({
        _id: userId,
      }).populate("wallet");

    if (!account)
      return res.status(404).send({
        ok: false,
        message: `${accountType} Not Found`,
      });
    //  check pin
    if (account.wallet.pin != pin) {
      return res.status(401).send({
        ok: false,
        message: "Incorrect pin",
      });
    }

    // account wallet
    let accountWallet = account.wallet;

    // check account wallet balance and requested amount
    if (
      accountWallet.balance <= 0 ||
      requested_amount > accountWallet.balance
    ) {
      return res.status(400).send({
        ok: true,
        message: "Insufficient funds",
      });
    }

    // calculating new balance
    const oldBalance = accountWallet.balance;
    const newBalance = oldBalance - requested_amount;
    let historyObject = null;

    // Create Recipient
    const recipient = await resolveAccount(accountNumber, bankCode);

    const { account_number, account_name } = recipient;

    // Create Recipient
    const createdRecipient = await createRecipient(
      account_number,
      bankCode,
      account_name
    );

    // Example usage
    const initiateWithdrawalResponce = await initiateWithdrawal(
      createdRecipient.recipient_code,
      requested_amount
    );

    const {
      amount,
      currency,
      reference,
      source,
      status,
      transfer_code,
      createdAt,
    } = initiateWithdrawalResponce.data;

    const convertAmount = amount / 100;
    // save document
    let instantWithdrawal = new InstantWithdrawal({
      owner: userId,
        amount: convertAmount,
        currency,
        paymentId: reference,
        source,
        status,
        transfer_code,
        requested_time: createdAt,
      });


    const saveInstantWithdrawal = instantWithdrawal.save();
    if (!saveInstantWithdrawal) {
      return res.status(500).send({
        okay: false,
        message: "Error saving withdrawal",
      });
    }
    // save history
    // Create wallet history entry
    await walletHistoryModel.create({
      owner: userId,
      wallet: accountWallet._id,
      type: "debit",
      description: "Withdraw From Wallet",
      newBalance,
      oldBalance,
      amount: requested_amount
    });


      // store history id to wallet history array
    let updatedWallet = await Wallet.findOneAndUpdate(
        {
          _id: accountWallet._id,
        owner: userId,
        },
        {
          balance: newBalance,
        },
        {
          new: true,
        }
      );


    console.log(
      "initiateWithdrawal success",
      initiateWithdrawalResponce.message
    );
    res.send({ okay: true });
  } catch (error) {
    console.log(error);
    // Handle errors
    res.status(500).send({ okay: false, error, message: "Error Making Transfer" });
  }

  return;
});

module.exports = {
  createRecipient,
  resolveAccount,
  initiateWithdrawal,
  instantWithdrawalRoute,
};

// Function to initiate a withdrawal
async function initiateWithdrawal(recipient_code, amount) {
  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const data = {
    source: "balance",
    amount: amount * 100, // Paystack API expects the amount in kobo (multiply by 100)
    recipient: recipient_code,
    type: "nuban",
    currency: "NGN", // Replace with the appropriate currency code if different from NGN (Nigerian Naira)
    // bank_code: bankCode,
  };
  // log(data);
  // return;

  try {
    const response = await axios.post(
      `${PAYSTACK_API_BASE_URL}/transfer`,
      data,
      { headers }
    );
    // console.log("Withdrawal request successful:", response.data);
    // Handle success and other relevant information
    return response.data;
  } catch (error) {
    console.error("Withdrawal request failed:", error.response.data);
    // Handle error response
    throw error.response.data;
  }
}

async function createRecipient(accountNumber, bankCode, accountName) {
  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const data = {
    type: "nuban", // Account type (nuban for NUBAN accounts in Nigeria)
    name: accountName,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: "NGN", // Currency code (Nigerian Naira)
  };

  log({ data });
  try {
    const response = await axios.post(
      `${PAYSTACK_API_BASE_URL}/transferrecipient`,
      data,
      { headers }
    );
    return response.data.data; // Recipient object with ID
  } catch (error) {
    console.error("Error creating recipient:", error.response.data);
    throw error;
  }
}

async function resolveAccount(accountNumber, bankCode) {
  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `${PAYSTACK_API_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      { headers }
    );

    // log(response.data.message);
    return response.data.data; // Recipient object with ID
  } catch (error) {
    console.error("Error creating recipient:", error.response.data);
    throw error.response.data;
  }
}
