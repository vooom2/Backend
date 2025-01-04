const complaintModel = require("../models/complaintModel");
const Vehicle = require("../models/vehicleModel");
const startComplaint = async (req, res) => {
  try {
    const { userId } = res.locals;
    const assignedBike = await Vehicle.findOne({ rider: userId }).lean();
    const vehicleId = assignedBike ? assignedBike._id : null;

    const { category, date, time, fleetManager, location, detail, images } =
      req.body;
    const complaint = await complaintModel.create({
      rider: userId,
      vehicle: vehicleId,
      category,
      date,
      time,
      fleetManager,
      location,
      detail,
      images,
    });
    res.status(201).json({ ok: true, complaint });
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({ ok: false, message: "error ", error: error.message });
  }
};

module.exports = { startComplaint };
