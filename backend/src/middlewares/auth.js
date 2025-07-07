const { API_STATUS } = require("../config/api");
const useUserServices = require("../services/user.service");
const { verifyToken } = require("../utils/jwt");

authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: API_STATUS.FAIL,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken({ token }); // Reuses JWT utility

    const user = await useUserServices.findUser({
      filter: {
        _id: payload.uid,
        isDeleted: false,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: API_STATUS.FAIL,
        message: "Unauthorized user or expired token",
      });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({
      status: API_STATUS.ERROR,
      message: error.message || "Unauthorized user or expired token",
    });
  }
};

module.exports = {
  authenticateUser,
};