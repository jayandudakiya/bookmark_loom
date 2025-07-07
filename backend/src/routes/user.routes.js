const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/user.controller");
const userRoutes = express.Router();

userRoutes.get("/profile", authenticateUser, getUserProfile);
userRoutes.post("/update", authenticateUser, updateUserProfile);
userRoutes.post("/delete", authenticateUser, deleteUserProfile);

module.exports = userRoutes;
