const inspectionModel = require("../models/inspectionModel");
const riderModel = require("../models/riderModel");
const vehicleModel = require("../models/vehicleModel");
const walletHistoryModel = require("../models/walletHistoryModel");
const { startOfWeek, endOfWeek } = require("date-fns");

const ownerDashboardStats = async ({ userId }) => {
  try {
    async function totalWithdrawn() {
      const totalWithdrawn = await walletHistoryModel
        .find({
          owner: userId,
          type: "debit",
        })
        .select("amount")
        .exec();

      console.log(totalWithdrawn);

      if (!totalWithdrawn) {
        return res.status(200).send({
          ok: true,
          totalWithdrawnAmount: 0,
        });
      }

      let totalWithdrawnAmount = 0;
      for (const withdrawn of totalWithdrawn) {
        totalWithdrawnAmount += withdrawn.amount;
      }

      return totalWithdrawnAmount;
    }

    async function calculateWeeklyAmount(userId) {
      try {
        // Validate userId
        if (!userId) {
          throw new Error("userId is required");
        }

        // Get current week's date range
        const weekStart = startOfWeek(new Date());
        const weekEnd = endOfWeek(new Date());

        // Use aggregation for better performance
        const result = await walletHistoryModel.aggregate([
          {
            $match: {
              owner: new mongoose.Types.ObjectId(userId),
              type: "credit",
              createdAt: {
                $gte: weekStart,
                $lte: weekEnd,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              transactionCount: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              totalAmount: { $ifNull: ["$totalAmount", 0] },
              transactionCount: 1,
            },
          },
        ]);

        // If no transactions found, return default values
        if (result.length === 0) {
          return {
            totalAmount: 0,
          };
        }

        return result[0].totalAmount;
      } catch (error) {
        throw new Error(`Failed to calculate weekly amount: ${error.message}`);
      }
    }

    async function totalActiveVehicles() {
      const totalActiveVehicles = await vehicleModel
        .countDocuments({
          vehicle_owner: userId,
          active_vehicle: true,
          verified_vehicle: true,
        })
        .exec();
      return totalActiveVehicles;
    }

    async function totalInactiveVehicles() {
      const totalInactiveVehicles = await vehicleModel
        .countDocuments({
          vehicle_owner: userId,
          active_vehicle: false,
        })
        .exec();
      return totalInactiveVehicles;
    }

    return {
      totalWithdrawn: await totalWithdrawn(),
      weeklyAmount: await calculateWeeklyAmount(userId),
      totalActiveVehicles: await totalActiveVehicles(),
      totalInactiveVehicles: await totalInactiveVehicles(),
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

const ownerVehicleStats = async ({ userId }) => {
  try {
    async function totalActiveVehicles() {
      const totalActiveVehicles = await vehicleModel
        .countDocuments({
          vehicle_owner: userId,
          active_vehicle: true,
          verified_vehicle: true,
        })
        .exec();
      return totalActiveVehicles;
    }

    async function totalInactiveVehicles() {
      const totalInactiveVehicles = await vehicleModel
        .countDocuments({
          vehicle_owner: userId,
          active_vehicle: false,
        })
        .exec();
      return totalInactiveVehicles;
    }

    async function totalVehicles() {
      const totalVehicles = await vehicleModel
        .countDocuments({
          vehicle_owner: userId,
        })
        .exec();
      return totalVehicles;
    }

    return {
      totalActiveVehicles: await totalActiveVehicles(),
      totalInactiveVehicles: await totalInactiveVehicles(),
      totalVehicles: await totalVehicles(),
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

const ownerVehiclesAndDetails = async ({ userId }) => {
  try {
    const vehicles = await vehicleModel.find({ vehicle_owner: userId });

    const vehiclesWithRiderAndInspection = await Promise.all(
      vehicles.map(async (vehicle) => {
        const rider = await riderModel.findOne({ _id: vehicle.rider });
        const inspection = await inspectionModel.countDocuments({
          vehicle: vehicle._id,
        });

        return {
          ...vehicle.toObject(),
          rider: rider ? rider.toObject() : null,
          inspection_count: inspection ? inspection : 0,
        };
      })
    );

    return vehiclesWithRiderAndInspection;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  ownerDashboardStats,
  ownerVehicleStats,
  ownerVehiclesAndDetails,
};
