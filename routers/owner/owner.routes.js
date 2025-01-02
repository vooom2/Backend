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
        vehicle_type: Joi.string().min(3).max(100).required(),
        color: Joi.string().min(3).max(100).required(),
        plate_number: Joi.number().min(100).required(),
        vehicle_number: Joi.string().min(10).max(200).required(),
        vehicle_images: Joi.array().items(Joi.string().uri()).min(1).required(),
        chasis_state: Joi.string().min(3).max(100).required(),
        initial_mileage: Joi.number().min(0).required(),
        features: Joi.array().items(Joi.string()).min(1).required(),
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
      const vehicles = await vehicleModel
        .find({ vehicle_owner: userId })
        .populate("rider", "name email");
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
        .populate("rider", "name email");
      if (!vehicle) {
        return res.status(404).send({
          ok: false,
          message: "Vehicle not found",
        });
      }
      return res.status(200).send({
        ok: true,
        vehicle,
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

      const newBankAccount = new bankAccountModel({
        account_name,
        account_number,
        bank_code,
        bank_name,
        user_id: userId,
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
          message: "Bank account not found",
        });
      }

      if (wallet.withdrawal_pin !== withdrawal_pin) {
        return res.status(401).send({
          ok: false,
          message: "Incorrect withdrawal pin",
        });
      }

      // Perform withdrawal logic here
      // For example, create a withdrawal transaction and update balance

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

module.exports = ownerRoute;
