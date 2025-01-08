const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

const inKobo = (amount) => {
  return amount * 100;
};

const inNaira = (amount) => {
  return amount / 100;
};

paystack.runTransfer = async ({ amount, recipient, reason, reference }) => {
  try {
    const response = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: amount,
        recipient: recipient,
        reason: reason,
        reference: reference, // Optional
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Transfer failed");
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    throw new Error(`Transfer request failed: ${error.message}`);
  }
};

module.exports = {
  inKobo,
  inNaira,
  paystack,
};
