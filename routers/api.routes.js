// routes/index.js

const { Router } = require("express");
const { jwtValidator } = require("../middleware/jwt");

// Route definitions with metadata
const routes = [
  {
    path: "/plans",
    router: require("./protectionPlanRoute"),
    public: true,
  },
  {
    path: "/auth",
    router: require("./authRoute"),
    public: true,
  },
  {
    path: "/vehicle",
    router: require("./vehicleRoute"),
    public: true,
  },
  {
    path: "/sendMail",
    router: require("./sendMail"),
    public: true,
  },
  {
    path: "/utils",
    router: require("./utility.Routes"),
    public: true,
  },
  {
    path: "/notification",
    router: require("./notificationRouter"),
  },
  {
    path: "/user",
    router: require("./userRoute"),
  },
  {
    path: "/admin",
    router: require("./adminRoute"),
  },
  {
    path: "/payment/verify",
    router: require("./payments/payment.webhook"),
    public: true,
  },
  {
    path: "/payment",
    router: require("./paymentRoute"),
  },
  {
    path: "/wallet",
    router: require("./walletRoute"),
  },
  {
    path: "/withdrawal",
    router: require("./instantWithdrawalRoute").instantWithdrawalRoute,
  },
  {
    path: "/media",
    router: require("./media.routes"),
  },
  {
    path: "/fleet-managers",
    router: require("./fleetManager.routes"),
  },
];

// Initialize router
const apiRoutes = Router();

// Register routes
routes.forEach(({ path, router, public: isPublic }) => {
  const middlewares = isPublic ? [] : [jwtValidator];
  apiRoutes.use(path, ...middlewares, router);
});

// Error handling for undefined routes
apiRoutes.use("*", (req, res) => {
  res.status(404).json({
    ok: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
apiRoutes.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = apiRoutes;
