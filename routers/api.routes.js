const apiRoutes = require("express").Router();
//
const authRoute = require("./authRoute");
const protectionPlan = require("./protectionPlanRoute");
const vehicleRoute = require("./vehicleRoute");
const { jwtValidator } = require("../middleware/jwt");
const notificationRoute = require("./notificationRouter");
const userRoute = require("./userRoute");
const paymentRoute = require("./paymentRoute");
const walletRoute = require("./walletRoute");
const { instantWithdrawalRoute } = require("./instantWithdrawalRoute");
const adminRoute = require("./adminRoute");
const sendMail = require("./sendMail");
const mediaRoutes = require("./media.routes");

apiRoutes.use("/sendMail/", sendMail);
apiRoutes.use("/plans", protectionPlan);
apiRoutes.use("/auth", authRoute);
apiRoutes.use("/vehicle", vehicleRoute);
apiRoutes.use("/notification", jwtValidator, notificationRoute);
apiRoutes.use("/user", jwtValidator, userRoute);
apiRoutes.use("/admin", jwtValidator, adminRoute);
apiRoutes.use("/payment", jwtValidator, paymentRoute);
apiRoutes.use("/wallet", jwtValidator, walletRoute);
apiRoutes.use("/withdrawal", jwtValidator, instantWithdrawalRoute);
apiRoutes.use("/media", jwtValidator, mediaRoutes);
apiRoutes.use("/utils", require("./utility.Routes"));

module.exports = apiRoutes;
