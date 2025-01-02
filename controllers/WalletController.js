const walletHistoryModel = require("../models/walletHistoryModel");
const walletModel = require("../models/walletModel");

async function GET_WALLET_CONTROLLER({ userId, accountType }) {
  try {
    let wallet = null;
    if (accountType === "business") {
      wallet = await walletModel.findOne({ business: userId });
    }
    if (accountType === "rider") {
      wallet = await walletModel.findOne({ rider: userId });
    }

    if (wallet == null) {
      throw {
        okay: false,
        message: "No wallet found",
      };
    }
    return {
      okay: true,
      wallet,
    };
  } catch (error) {
    console.log("Error GET_WALLET_CONTROLLER", error.message);

    throw {
      okay: false,
      message: "Error getting wallet",
      error: error.message,
    };
  }
}
async function GET_WALLET_HISTORY_CONTROLLER({ userId, accountType }) {
  try {
    let history = null;

    if (accountType === "business") {
      history = await walletHistoryModel.find({ business: userId });
    }
    if (accountType === "rider") {
      history = await walletHistoryModel.find({ rider: userId });
    }

    if (history == null) {
      throw {
        okay: false,
        message: "No history found",
      };
    }
    return {
      okay: true,
      history,
    };
  } catch (error) {
    console.log("Error GET_WALLET_HISTORY_CONTROLLER", error.message);
    throw {
      okay: false,
      message: "Error getting wallet history",
      error: error.message,
    };
  }
}

async function CREDIT_BUSINESS_WALLET_ON_ORDER(updateOrder, io) {
  try {
    const { business, sub_total, items, packages, discount } = updateOrder;

    let calculated_amount = 0;

    const packagePrice = business.package_price || 0;
    const packageCount = packages?.length;
    const packPriceTotal = packageCount * packagePrice;

    //  console.log({ items, packages: JSON.stringify(packages) });

    const totalItemPrice = items.reduce((acc, item) => {
      //  console.log("Item -->", {
      //    item_name: item.name,
      //    item_unit_prices: item.unit_prices,
      //    item_count: item.count,
      //    item_total: item.unit_prices * item.count,
      //  });
      return acc + item.unit_prices;
    }, 0);

    const totalPackPrice = packages.reduce((acc, subArray) => {
      const subTotal = subArray.reduce((subAcc, item) => {
        //  console.log("pack Items -->", {
        //    item_name: item.name,
        //    item_unit_prices: item.unit_prices,
        //    item_count: item.count,
        //    item_total: item.unit_prices * item.count,
        //  });
        return subAcc + item.unit_prices;
      }, 0);
      return acc + subTotal;
    }, 0);

    let calculated_food_amount = totalItemPrice + totalPackPrice;

    //  console.log("CREDIT_BUSINESS_WALLET_ON_ORDER", {
    //    totalItemPrice,
    //    totalPackPrice,
    //    packPriceTotal,
    //    packagePrice,
    //    packageCount,
    //    calculated_amount,
    //    calculated_food_amount,
    //  });

    if (discount) {
      // Get discount document
      const discountDocument = await discountModel.findOne({ _id: discount });
      if (discountDocument) {
        const { type, discount: discountAmount } = discountDocument;
        if (type === "percent") {
          const calculatePercent =
            (calculated_food_amount * discountAmount) / 100;
          calculated_food_amount = calculated_food_amount - calculatePercent;
        } else if (type === "rate") {
          calculated_food_amount = calculated_food_amount - discountAmount;
        }

        //  console.log("CREDIT_BUSINESS_WALLET_ON_ORDER Discount", {
        //    totalItemPrice,
        //    totalPackPrice,
        //    packPriceTotal,
        //    calculated_food_amount,
        //    calculated_amount,
        //    type,
        //    discountAmount,
        //  });
      }
    }

    calculated_amount = calculated_food_amount + packPriceTotal;
    // update business wallet balance
    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        business: business,
      },
      {
        $inc: { balance: Math.floor(calculated_amount) }, // Update
      }
    );

    // create new wallet history
    const historyObject = new WalletHistory({
      business: business,
      wallet: updatedWallet._id,
      amount: Math.floor(calculated_amount),
      newBalance: Math.floor(updatedWallet.balance + calculated_amount),
      oldBalance: Math.floor(updatedWallet.balance),
      description: "Processed Order",
      pending: false,
      approved: true,
      rejected: false,
    });

    // // save history
    const saveHistory = await historyObject.save();
    //  console.log("CREDIT_BUSINESS_WALLET_ON_ORDER", { updatedWallet });
    SEND_NOTIFICATION_FUNCTION(
      business,
      `${Math.floor(
        calculated_amount
      )} was added to your wallet for a processed order`
    );

    // Get wallet
    const businessWallet = await GET_WALLET_CONTROLLER({
      userId: business,
      accountType: "business",
    });

    io.to(`businessRoom:${business}`).emit(
      "business_getWallet",
      businessWallet
    );

    // Get wallet history
    const businessWalletHistory = await GET_WALLET_HISTORY_CONTROLLER({
      userId: business,
      accountType: "business",
    });

    io.to(`businessRoom:${business}`).emit(
      "business_getWalletHistory",
      businessWalletHistory
    );

    await orderGroupModel.findOneAndUpdate(
      { _id: updateOrder._id },
      {
        $set: {
          original_sub_total: calculated_food_amount,
        },
      }
    );
    return updatedWallet;
  } catch (error) {
    console.log({
      okay: false,
      message: "Error CREDIT_BUSINESS_WALLET_ON_ORDER",
      error: error.message,
    });
  }
}

module.exports = { GET_WALLET_CONTROLLER, GET_WALLET_HISTORY_CONTROLLER };
