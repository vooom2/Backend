const { SEND_NOTIFICATION_FUNCTION } = require("../controllers/notificationController");
const { sendMailFunction } = require("../middleware/Mail");
const adminModel = require("../models/adminModel");
const approvalModel = require("../models/approvalModel");
const inspectionModel = require("../models/inspectionModel");
const riderModel = require("../models/riderModel");
const vehicleModel = require("../models/vehicleModel");
const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const jwt = require("jsonwebtoken");
const adminRoute = require("express").Router();

adminRoute.get("/", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { admin_id, account_type } = req.query;
  try {
    // const notifications = await Notification.find();

    let query = {}
    if (accountType !== "admin") {
      return res.send(401).send({
        ok: false,
        message: "Account not allowed to make request"
      })
    }

    if (account_type) {
      query.account_type = account_type
    }
    if (admin_id) {

      let admin = await adminModel.findOne({ _id: admin_id }).populate("invited_by", "full_name");


      return res.send({ ok: true, admin });
    }

    // 

    let admins = await adminModel.find(query).populate("invited_by", "full_name");


    return res.send({ ok: true, admins });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error getting admins",
      error: `${error.message}`,
    });
  }
});
adminRoute.get("/rider", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { rider_id, } = req.query;
  try {
    // const notifications = await Notification.find();

    let query = {}
    if (accountType !== "admin") {
      return res.send(401).send({
        ok: false,
        message: "Account not allowed to make request"
      })
    }


    if (rider_id) {
      let rider = await riderModel.findOne({ _id: rider_id })

      return res.send({ ok: true, rider }); 
    }

    // 

    let riders = await riderModel.find(query)

    return res.send({ ok: true, riders });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error getting riders",
      error: `${error.message}`,
    });
  }
});
adminRoute.get("/owner", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { owner_id } = req.query;
  try {
    // const notifications = await Notification.find();

    let query = {}
    if (accountType !== "admin") {
      return res.send(401).send({
        ok: false,
        message: "Account not allowed to make request"
      })
    }


    if (owner_id) {

      let owner = await vehicleOwnerModel.findOne({ _id: owner_id }).populate("wallet", "-bank.selectedBank -bank.pin")


      return res.send({ ok: true, owner });
    }

    // 

    let owners = await vehicleOwnerModel.find(query).populate("wallet", "-bank.selectedBank -bank.pin")


    return res.send({ ok: true, owners });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error getting owners",
      error: `${error.message}`,
    });
  }
});

adminRoute.put("/", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { account_id, account_type } = req.query;
  if (accountType !== "admin") {
    return res.send(401).send({
      ok: false,
      message: "Account not allowed to make request"
    })
  }
  // console.log({ account_id, account_type })
  if (!account_id || account_id === "") {
    return res.send(401).send({
      ok: false,
      message: "Admin ID is required"
    })
  }


  const profileUpdate = req.body;
  try {
    let newProfileUpdate = null;
    if (account_type === "rider") {
      newProfileUpdate = await riderModel.findByIdAndUpdate(
        { _id: account_id },
        profileUpdate,
        { new: true }
      );
    }
    if (account_type === "owner") {
      newProfileUpdate = await vehicleOwnerModel.findByIdAndUpdate(
        { _id: account_id },
        profileUpdate,
        { new: true }
      );
    }
    if (account_type === "admin" || account_type === "manger" || account_type === "compliance" || account_type === 'accountant') {
      newProfileUpdate = await adminModel.findByIdAndUpdate(
        { _id: account_id },
        profileUpdate,
        { new: true }
      );
    }
    if (!newProfileUpdate) {
      return res
        .status(404)
        .send({ ok: false, message: "Profile was not updated" });
    }
    return res.send({ ok: true, newProfileUpdate });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error updating profile",
      error: `${error.message}`,
    });
  }
});

adminRoute.get("/vehicle", async (req, res) => {
  const { vehicle_id } = req.query;
  try {
    // console.log({ userId, accountType });
    if (vehicle_id) {
      const vehicle = await vehicleModel.findOne({
        _id: vehicle_id,
      })
        .populate("vehicle_owner", "full_name createdAt")
        .populate("rider", "full_name")
      let hostedVehicle = [];
      if (
        vehicle
      ) {
        // console.log({ vehicle })

        hostedVehicle = await vehicleModel.find({
          vehicle_owner: vehicle.vehicle_owner._id,
        });
      }
      // vehicle.vehicle_owner.hostedVehicle = hostedVehicle.length
      // Directly add the hostedVehicle count to the populated vehicle_owner
      if (vehicle.vehicle_owner) {
        vehicle.vehicle_owner = vehicle.vehicle_owner.toObject(); // Convert to plain object
        vehicle.vehicle_owner.hostedVehicle = hostedVehicle.length; // Add hostedVehicle property
      }
      // console.log(vehicle.vehicle_owner)
      if (!vehicle) {
        return res.status(404).send({
          okay: false,
          message: "No vehicle found with this ID",
        });
      }
      return res.status(200).send({
        okay: true,
        vehicle,
      });
    }

    let query = {}


    const vehicles = await vehicleModel.find(query).populate("vehicle_owner", "full_name createdAt")
      .populate("rider", "full_name")
    return res.status(200).send({
      okay: true,
      vehicles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting protection plans",
      error: error.message,
    });
  }
});

adminRoute.put("/vehicle", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { vehicle_id } = req.query

  const vehicleUpdate = req.body;
  try {
    let newVehicleUpdate = await vehicleModel.updateOne({ _id: vehicle_id }, vehicleUpdate, { new: true });
    if (!newVehicleUpdate.acknowledged) {
      return res
        .status(404)
        .send({ ok: false, message: "Vehicle was not updated" });
    }
    return res.send({ ok: true });
  } catch (error) {
    // console.log(error.keyValue);
    res.status(500).send({
      ok: false,
      message: "Error updating Vehicle",
      error: error.message,
    });
  }
});

adminRoute.put("/assign", async (req, res) => {
  const { userId, accountType } = res.locals;
  if (accountType !== "admin") {
    return res.send(401).send({
      ok: false,
      message: "Account not allowed to make request"
    })
  }
  const { vehicle_id, rider_id } = req.body;
  try {
    if (!vehicle_id) {
      return res.status(400).send({
        ok: false,
        message: "Vehicle Id is required"
      })
    }
    if (!rider_id) {
      return res.status(400).send({
        ok: false,
        message: "Rider Id is required"
      })
    }
    let vehicle = await vehicleModel.findOne({ _id: vehicle_id });
    let rider = await riderModel.findOne({ _id: rider_id });
    if (!vehicle) {
      return res.status(404).send({
        ok: false,
        message: "Vehicle not found"
      })
    }
    if (!rider) {
      return res.status(404).send({
        ok: false,
        message: "Rider not found"
      })
    }
    if (!rider.account_verified) {
      return res.status(401).send({
        ok: false,
        message: "Rider not verified"
      })
    }
    if (!rider.account_active) {
      return res.status(401).send({
        ok: false,
        message: "Rider not active"
      })
    }
    if (rider.vehicle !== null) {
      return res.status(40).send({
        ok: false,
        message: "Rider have an active vehicle"
      })
    }
    if (!vehicle.verified_vehicle) {
      return res.status(401).send({
        ok: false,
        message: "Vehicle not verified"
      })
    }
    if (!vehicle.active_vehicle) {
      return res.status(401).send({
        ok: false,
        message: "Vehicle not active"
      })
    }
    if (vehicle.rider !== null) {
      return res.status(401).send({
        ok: false,
        message: "Vehicle have an active rider"
      })
    }

    // TODO: add log of the admin that assigned vehicle to rider
    SEND_NOTIFICATION_FUNCTION(rider.id, "Vehicle had been assigned to you by admin")
    vehicle.rider = rider._id
    rider.vehicle = vehicle._id

    await vehicle.save()
    await rider.save()

    return res.send({ ok: true });
  } catch (error) {
    // console.log(error.keyValue);
    res.status(500).send({
      ok: false,
      message: "Error updating Vehicle",
      error: error.message,
    });
  }
});

adminRoute.post(
  "/approval",

  async (req, res) => {
    const { userId, accountType } = res.locals;
    const {
      rider,
      vehicle,
      description,
      status
    } = req.body;
    try {


      const newApproval = new approvalModel({
        rider,
        vehicle,
        description,
        status
        , admin: userId
      });

      // create Notification
      SEND_NOTIFICATION_FUNCTION(userId, "Approval request created");
      // SEND_NOTIFICATION_FUNCTION(
      //   vehicle.vehicle_owner,
      //   "Inspection was Booked"
      // );

      const saveApproval = await newApproval.save()

      return res.status(200).send({
        okay: true,
        // vehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting protection plans",
        error: error.message,
      });
    }
  }
);


adminRoute.get("/approval", async (req, res) => {
  const { approval_id } = req.query;
  try {
    // console.log({ userId, accountType });
    if (approval_id) {
      const approval = await approvalModel.findOne({
        _id: approval_id,
      })
        .populate("admin", "full_name ")
        .populate("approved_by", "full_name ")
        .populate("rider", "full_name")

      if (!approval) {
        return res.status(404).send({
          okay: false,
          message: "No approval found with this ID",
        });
      }
      return res.status(200).send({
        okay: true,
        approval,
      });
    }

    let query = {}


    const approvals = await approvalModel.find(query)
      .populate("admin", "full_name ")
      .populate("updated_by", "full_name ")
      .populate("rider", "full_name")
    return res.status(200).send({
      okay: true,
      approvals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting protection plans",
      error: error.message,
    });
  }
});

adminRoute.put("/approval", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { approval_id } = req.query

  const approvalUpdate = req.body;
  try {
    let newApprovalUpdate = await approvalModel.updateOne({ _id: approval_id }, { ...approvalUpdate, updated_by: userId }, { new: true });
    if (!newApprovalUpdate.acknowledged) {
      return res
        .status(404)
        .send({ ok: false, message: "approval was not updated" });
    }
    return res.send({ ok: true });
  } catch (error) {
    // console.log(error.keyValue);
    res.status(500).send({
      ok: false,
      message: "Error updating approval",
      error: error.message,
    });
  }
});

adminRoute.put("/update-rider-document-status", async (req, res) => {
  const { userId, verified, documentType, documentId } = req.body; // New verified status from request body

  if (!documentType || !documentId || typeof verified !== "boolean") {
    return res.status(400).send({
      ok: false,
      message: "Missing or invalid parameters. Ensure documentType, documentId, and verified are provided.",
    });
  }

  try {
    let updateField = {};
    if (documentType === "guarantor") {
      updateField = {
        "guarantor_documents.$.verified": verified,
      };
    } else if (documentType === "verification") {
      updateField = {
        "verification_documents.$.verified": verified,
      };
    } else {
      return res.status(400).send({
        ok: false,
        message: "Invalid documentType. Allowed values: 'guarantor', 'verification'.",
      });
    }

    const updatedRider = await riderModel.findOneAndUpdate(
      {
        _id: userId,
        [`${documentType}_documents._id`]: documentId, // Match the document by ID
      },
      { $set: updateField }, // Set the verified field
      { new: true } // Return the updated document
    );

    if (!updatedRider) {
      return res.status(404).send({
        ok: false,
        message: "Document not found or user not found.",
      });
    }

    res.send({
      ok: true,
      message: `${documentType}_document updated successfully.`,
      data: updatedRider,
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Error updating document status.",
      error: error.message,
    });
  }
});

adminRoute.get("/inspection", async (req, res) => {
  const { inspection_id, vehicle_id, rider_id } = req.query;
  try {
    // console.log({ userId, accountType });
    if (inspection_id) {
      const inspection = await inspectionModel.findOne({
        _id: inspection_id,
      })
        .populate("vehicle")
        .populate("rider", "full_name")

      if (!inspection) {
        return res.status(404).send({
          okay: false,
          message: "No inspection found with this ID",
        });
      }
      return res.status(200).send({
        okay: true,
        inspection,
      });
    }
    let query = {}

    if (vehicle_id) { query = { vehicle: vehicle_id } }
    if (rider_id) { query = { rider: rider_id } }

    const inspections = await inspectionModel.find(query)
      .populate("vehicle")
      .populate("inspector", "full_name")
      .populate("rider", "full_name")
    return res.status(200).send({
      okay: true,
      inspections,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting inspection",
      error: error.message,
    });
  }
});

adminRoute.put("/inspection", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { inspection_id } = req.query

  const { reason, status } = req.body;
  try {

    if (status === "Failed") {
      const inspection = await inspectionModel.findOne({
        _id: inspection_id,
      })
      const updateVehicle = await vehicleModel.findByIdAndUpdate({ _id: inspection.vehicle }, {
        active_vehicle: false
      })

      // send mail to owner
      // TODO: update comment to owners name and email
      await sendMailFunction({
        // receiverEmail: updateVehicle.vehicle_owner.email,
        receiverEmail: "victorjosiahm3@gmail.com",
        senderName: "Vooom Support",
        emailSubject: "Vehicle Inspection Report",
        body: {
          // name: updateVehicle.vehicle_owner.full_name,
          name: "Victor Josiah",

          intro: [
            "This is a notification on inspection of your vehicle on VOOOM Management platform?",
          ],
          outro: [
            "Need help, or have questions?",
            "Just reply to this email, we'd love to help.",
          ],
        },
        others: {
          res,
        },
      });
    }
    let newInspectionUpdate = await inspectionModel.updateOne({ _id: inspection_id }, {
      reason, status, inspector: userId
    }, { new: true });
    if (!newInspectionUpdate.acknowledged) {
      return res
        .status(404)
        .send({ ok: false, message: "inspection was not updated" });
    }
    return res.send({ ok: true });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error updating inspection",
      error: error.message,
    });
  }
});
adminRoute.post("/invite", async (req, res) => {
  const { userId, accountType } = res.locals;

  const { to, account_type } = req.body;

  if (!to) {
    return res.send({
      ok: false,
      message: "Mail required fields is not provided",
    });
  }
  if (to === "") {
    return res.send({ ok: false, message: "Mail required fields is empty" });
  }
  // console.log({ to })

  let emailSubject;
  emailSubject = "Admin Invitation";

  try {

    // console.log(otpObject);
    // return;
    const invitationLink = generateInvitationLink(userId, to, account_type);

    // {
    // Read MailGen Doc to structure massage body
    // https://www.npmjs.com/package/mailgen
    // }

    await sendMailFunction({
      receiverEmail: to,
      senderName: "Vooom Super Admin",
      emailSubject,
      body: {
        name: "Admin",
        action: {
          instructions: `You are invited to join Vooom Admin as (${account_type === "admin" ? "Super Admin" : account_type[0].toUpperCase() + account_type.slice(1)}). Please click the button below to accept the invitation and get started:`,
          button: {
            // color: "#000000", // Optional action button color
            text: `<a href=${invitationLink} style="background-color: #f46702; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Accept Invitation</a>`,
          },
        },
        outro: [
          "Do not disclose this OTP to anyone",
          "Need help, or have questions?",
          "Just reply to this email, we'd love to help.",
        ],
      },
      others: {
        res,
      },
    });

    res.send(JSON.stringify({ ok: true, }));
  } catch (error) {
    console.log({ error })
    res
      .status(500)
      .send({ ok: false, message: "error ", error: error.message });
  }
});

module.exports = adminRoute;



const generateInvitationLink = (adminId, email, accountType) => {

  // Payload with admin details
  const payload = {
    adminId,
    email,
    accountType,
  };
  // const url = "https://vooom-admin.netlify.app"
  // const url = "http://localhost:3000"
  const url = "http://admin.vooom.live"
  // Generate a token that expires in 24 hours
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

  // Append token to your invitation URL
  const invitationLink = `${url}/register?token=${token}`;

  return invitationLink;
};

// // Example usage
// const link = generateInvitationLink("12345", "admin@example.com", "admin");
// console.log("Invitation Link:", link);
