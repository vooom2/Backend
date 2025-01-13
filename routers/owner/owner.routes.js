/**
 * @description This route is responsible for handling all
 * requests related to a vehicle owner's account.
 *
 * @requires {isVerifiedUser} - middleware to check if user is verified
 * @requires {isUserType} - middleware to check if user is of type owner
 * @module routers/owner/owner.routes
 * @author Samuel Ajayi
 * @version 1.0
 * @since 2021-04-15
 */
const ownerRoute = require("express").Router();
const Joi = require("joi");
const { hostVehicle } = require("../../controllers/vehicleController");
const { isVerifiedUser } = require("../../middleware/isVerifiedUser");
const { isUserType } = require("../../middleware/isVerifiedUser");
const vehicleModel = require("../../models/vehicleModel");
const bankAccountModel = require("../../models/bankAccountModel");
const Wallet = require("../../models/walletModel");
const {
  WITHDRAW_FROM_WALLET,
  GET_WALLET_STATS,
} = require("../../controllers/WalletController");
const { paystack } = require("../../helpers/paystack.helper");
const walletHistoryModel = require("../../models/walletHistoryModel");
paymentModel = require("../../models/paymentModel");
const {
  ownerDashboardStats,
  ownerVehicleStats,
  ownerVehiclesAndDetails,
} = require("../../controllers/ownerController");
const reportsModel = require("../../models/reportsModel");
const inspectionModel = require("../../models/inspectionModel");
const InstantWithdrawal = require("../../models/instantWithdrawalModel");

/**
 * @description Endpoint to host a vehicle
 * @param {Object} req.body - request body containing vehicle details
 * @returns {Object} - response object with message and hosted vehicle
 * @throws {Error} - if there is an error hosting the vehicle
 */
ownerRoute.post(
  "/host-vehicle",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId } = res.locals;

    try {
      const schema = Joi.object().keys({
        make: Joi.string().min(3).max(100).required(),
        model: Joi.string().min(3).max(100).required(),
        state: Joi.string().min(3).max(100).required(),
        lga: Joi.string().min(3).max(100).required(),
        // vehicle_type: Joi.string().min(3).max(100).required(),
        color: Joi.string().min(3).max(100).required(),
        // plate_number: Joi.number().min(100).required(),
        vehicle_number: Joi.string().min(10).max(200).required(),
        // vehicle_images: Joi.array().items(Joi.string().uri()).min(1).required(),
        chasis_state: Joi.string().min(3).max(100).required(),
        initial_mileage: Joi.number().min(0).required(),
        features: Joi.object().required(),
        documents: Joi.object()
          .keys({
            vio: Joi.string().uri().required(),
            amac: Joi.string().uri().required(),
            lga: Joi.string().uri().required(),
            insurance: Joi.string().uri().required(),
            receipt: Joi.string().uri().required(),
          })
          .required(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).send({
          ok: false,
          message: error.details[0].message,
        });
      }

      if (hostVehicle(req.body, userId))
        return res.status(201).send({
          ok: true,
          message: "Vehicle hosted successfully",
          vehicle: hostVehicle.vehicle,
        });

      return res.status(400).send({
        ok: false,
        message: "Error Hosting vehicle",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error Hosting vehicle",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to get all vehicles owned by user
 * @returns {Object} - response object with message and array of vehicles
 * @throws {Error} - if there is an error getting the vehicles
 */
ownerRoute.get(
  "/vehicles",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId, accountType } = res.locals;

    try {
      const vehicles = await ownerVehiclesAndDetails({ userId });

      if (!vehicles) {
        return res.status(500).send({
          ok: false,
          message: "Error getting vehicle",
        });
      }

      return res.status(200).send({
        ok: true,
        vehicles,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting vehicle",
        error: `${error.message}`,
      });
    }
  }
);

ownerRoute.get(
  "/vehicles/stats",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId, accountType } = res.locals;
    try {
      const stats = await ownerVehicleStats({ userId });
      if (!stats) {
        return res.status(500).send({
          ok: false,
          message: "Error getting vehicle stats",
        });
      }
      return res.status(200).send({
        ok: true,
        stats,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting vehicle stats",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to get a vehicle by ID
 * @param {string} req.params.id - id of the vehicle
 * @returns {Object} - response object with message and vehicle
 * @throws {Error} - if there is an error getting the vehicle
 */
ownerRoute.get(
  "/vehicles/:id",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { id } = req.params;

    try {
      const vehicle = await vehicleModel
        .findOne({ _id: id, vehicle_owner: userId })
        .populate("rider", "full_name email createdAt");
      if (!vehicle) {
        return res.status(404).send({
          ok: false,
          message: "Vehicle not found",
        });
      }

      const payments = await paymentModel
        .find({ vehicle: id })
        .populate("rider", "full_name");
      if (!payments) {
        return res.status(404).send({
          ok: false,
          message: "No payments found for this vehicle",
        });
      }

      const inspection = await inspectionModel.find({ vehicle: id });
      if (!inspection) {
        return res.status(404).send({
          ok: false,
          message: "No inspection found for this vehicle",
        });
      }

      return res.status(200).send({
        ok: true,
        vehicle,
        payments,
        inspection,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting vehicle",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to add a bank account
 * @param {Object} req.body - bank account details
 * @returns {Object} - response object with message and bank account
 * @throws {Error} - if there is an error adding the bank account
 */
ownerRoute.post(
  "/banks/add",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { account_number, account_name, bank_code, bank_name } = req.body;

    const schema = Joi.object({
      account_number: Joi.string().min(10).max(10).required(),
      account_name: Joi.string().required(),
      bank_code: Joi.string().min(2).max(6).required(),
      bank_name: Joi.string().required(),
    });

    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).send({
          ok: false,
          message: error.details[0].message,
        });
      }

      const existingAccount = await bankAccountModel.findOne({
        account_number,
        bank_code,
      });

      if (existingAccount) {
        return res.status(400).send({
          ok: false,
          message: "Account number and bank code already exists",
        });
      }

      const bankAccounts = await bankAccountModel.countDocuments({
        user_id: userId,
      });

      if (bankAccounts >= 3) {
        return res.status(400).send({
          ok: false,
          message: "You have up to 3 bank accounts, please remove some",
        });
      }

      const createdRecipient = await paystack.transfer_recipient.create({
        type: "nuban",
        name: account_name,
        account_number: account_number,
        bank_code: bank_code,
        currency: "NGN",
      });

      if (!createdRecipient.status) {
        return res.status(400).send({
          ok: false,
          message: "Error creating recipient",
        });
      }

      const recipient_code = createdRecipient.data.recipient_code;

      const newBankAccount = new bankAccountModel({
        account_name,
        account_number,
        bank_code,
        bank_name,
        user_id: userId,
        recipient_code,
      });

      const savedBankAccount = await newBankAccount.save();

      return res.status(201).send({
        ok: true,
        savedBankAccount,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error adding bank account",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to get all bank accounts
 * @returns {Object} - response object with message and bank accounts
 * @throws {Error} - if there is an error getting the bank accounts
 */
ownerRoute.get(
  "/banks",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId, accountType } = res.locals;

    try {
      const bankAccounts = await bankAccountModel.find({ user_id: userId });

      return res.status(200).send({
        ok: true,
        bankAccounts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting bank accounts",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to delete a bank account
 * @param {string} req.params.id - id of bank account to delete
 * @returns {Object} - response object with message
 * @throws {Error} - if there is an error deleting the bank account
 */
ownerRoute.delete(
  "/banks/:id",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { id } = req.params;

    try {
      const deletedBankAccount = await bankAccountModel.findOneAndDelete({
        _id: id,
        user_id: userId,
      });

      if (!deletedBankAccount) {
        return res.status(404).send({
          ok: false,
          message: "Bank account not found",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Bank account deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error deleting bank account",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to make a withdrawal from the owner's wallet
 * @param {Number} req.body.amount - amount to withdraw
 * @param {string} req.body.bank_account_id - id of bank account to withdraw to
 * @param {string} req.body.withdrawal_pin - owner's withdrawal pin
 * @returns {Object} - response object with message
 * @throws {Error} - if there is an error processing the withdrawal
 */
ownerRoute.post(
  "/withdraw",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId } = res.locals;
    const { amount, bank_account_id, withdrawal_pin } = req.body;

    try {
      if (!amount || amount <= 0) {
        return res.status(400).send({
          ok: false,
          message: "Invalid withdrawal amount",
        });
      }

      const wallet = await Wallet.findOne({ owner: userId });

      if (!wallet) {
        return res.status(404).send({
          ok: false,
          message: "Wallet not found",
        });
      }

      if (wallet.balance < amount) {
        return res.status(400).send({
          ok: false,
          message: "Insufficient wallet balance",
        });
      }

      const bankAccount = await bankAccountModel.findOne({
        _id: bank_account_id,
        user_id: userId,
      });

      if (!bankAccount) {
        return res.status(404).send({
          ok: false,
          message: "Bank account not found for user",
        });
      }

      if (wallet.pin != withdrawal_pin) {
        return res.status(400).send({
          ok: false,
          message: "Incorrect withdrawal pin ",
        });
      }

      // Perform withdrawal logic here

      const withdrawal = await WITHDRAW_FROM_WALLET({
        userId,
        accountNumber: bankAccount.account_number,
        requested_amount: amount,
        bankAccount,
        pin: withdrawal_pin,
      });

      if (!withdrawal.ok) {
        return res.status(500).send({
          ok: false,
          message: "Error processing wallet withdrawal -1",
          error: `${withdrawal.message}`,
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Withdrawal successful",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error processing withdrawal",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to get instant withdrawal history
 * @returns {Object} - response object with message and instant withdrawal history
 * @throws {Error} - if there is an error getting the instant withdrawal history
 */
ownerRoute.get(
  "/withdrawal-history",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId } = res.locals;

    try {
      const instantWithdrawalHistory = await InstantWithdrawal.find({
        owner: userId,
      }).sort({ createdAt: -1 });

      if (!instantWithdrawalHistory) {
        return res.status(404).send({
          ok: false,
          message: "No instant withdrawal history found",
        });
      }

      return res.status(200).send({
        ok: true,
        history: {
          ...instantWithdrawalHistory,
          account_number: "1125436581",
          account_name: "Henry Topher",
          bank_name: "Access Bank",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting instant withdrawal history",
        error: `${error.message}`,
      });
    }
  }
);

/**
 * @description Endpoint to get dashboard stats for the owner
 * @returns {Object} - response object with message and stats
 * @throws {Error} - if there is an error getting the dashboard stats
 */
ownerRoute.get(
  "/dashboard",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId } = res.locals;

    try {
      const stats = await ownerDashboardStats({ userId });

      if (!stats) {
        return res.status(500).send({
          ok: false,
          message: "Error getting dashboard data",
        });
      }

      return res.status(200).send({
        ok: true,
        stats,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting dashboard data",
        error: `${error.message}`,
      });
    }
  }
);

ownerRoute.get(
  "/wallet",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId, accountType } = res.locals;
    try {
      const walletStats = await GET_WALLET_STATS({ userId });

      if (!walletStats.ok) {
        return res.status(500).send({
          ok: false,
          message: walletStats.message,
        });
      }

      return res.status(200).send({
        ok: true,
        data: walletStats.data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting waallet",
        error: `${error.message}`,
      });
    }
  }
);

// get owner wallet details
ownerRoute.get(
  "/reports",
  isVerifiedUser,
  isUserType("owner"),
  async (req, res) => {
    const { userId } = res.locals;
    try {
      const { page = 1, limit = 10 } = req.query;
      const reports = await reportsModel.paginate(
        { owner: userId },
        {
          page,
          limit,
          sort: { createdAt: -1 },
        }
      );

      if (!reports) {
        return res.status(404).send({
          ok: false,
          message: "No reports found",
        });
      }

      return res.status(200).send({
        ok: true,
        reports,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        message: "Error getting reports",
        error: `${error.message}`,
      });
    }
  }
);



// ownerRoute.get('/create-wallet', isVerifiedUser, isUserType('owner'), async (req, res) => {
//   const { userId } = res.locals;
//   try {
//     const wallet = await Wallet.findOne({ owner: userId });
//     if (wallet) {
//       return res.status(400).send({
//         ok: false,
//         message: "Wallet already exists",
//       });
//     }

//     const newWallet = new Wallet({
//       owner: userId,
//     });

//     const savedWallet = await newWallet.save();

//     return res.status(201).send({
//       ok: true,
//       savedWallet,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       ok: false,
//       message: "Error creating wallet", error: `${error.message}`,
//     });
//   }
  
// });


module.exports = ownerRoute;
