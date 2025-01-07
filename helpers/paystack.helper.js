const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

const inKobo = (amount) => {
  return amount * 100;
};

module.exports = {
  inKobo,
  paystack,
};
