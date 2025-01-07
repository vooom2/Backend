const complaintModel = require("../models/complaintModel");
const Vehicle = require("../models/vehicleModel");
const startComplaint = async (req, res) => {
  try {
    const { userId } = res.locals;
    const assignedBike = await Vehicle.findOne({ rider: userId }).lean();
    const vehicleId = assignedBike ? assignedBike._id : null;

    if (!vehicleId) {
      return res
        .status(404)
        .json({ ok: false, message: "No assigned vehicle not found" });
    }

    console.log({ assignedBike, vehicleId });

    const { category, date, time, fleetManager, location, detail, images } =
      req.body;
    const complaint = await complaintModel.create({
      rider: userId,
      vehicle: vehicleId,
      category,
      date,
      time,
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

const getComplaints = async (req, res) => {
  try {
    const { userId } = res.locals;
    const assignedBike = await Vehicle.findOne({ rider: userId }).lean();
    const vehicleId = assignedBike ? assignedBike._id : null;
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      lean: true,
      sort: { createdAt: -1 },
    };
    const complaints = await complaintModel.paginate(
      { vehicle: vehicleId },
      options
    );
    res.status(200).json({ ok: true, complaints });
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({ ok: false, message: "error ", error: error.message });
  }
};

module.exports = { startComplaint, getComplaints };
