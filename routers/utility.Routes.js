const Joi = require("joi");
const utilityRoutes = require("express").Router();
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);


utilityRoutes.get("/banks", async (req, res) => {
  const banks = await paystack.misc.list_banks();
  res.send({ okay: true, banks });
});

utilityRoutes.post("/banks/resolve-account", async (req, res) => {
  const schema = Joi.object({
    account_number: Joi.string().min(10).max(10).required(),
    bank_code: Joi.string().max(6).min(2).required(),
    bank_name: Joi.string().max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      okay: false,
      message: error.details[0].message,
    });
  }

  const { account_number, bank_code, bank_name } = req.body;

  if (!account_number || !bank_code) {
    return res.status(400).send({
      okay: false,
      message: "account_number and bank_code are required",
    });
  }

  try {
    const accountDetail = await paystack.verification.resolveAccount({
      account_number,
      bank_code,
    });

    res.send({
      okay: true,
      accountDetail,
      bank_code,
      bank_name,
    });
  } catch (error) {
    res.status(500).send({
      okay: false,
      message: "Error resolving account",
      error: error.message,
    });
  }
});



module.exports = utilityRoutes;
