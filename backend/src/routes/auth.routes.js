const express = require("express");
const authRoutes = express.Router();
const {
  register,
  login,
  logout,
  changePassword,
  updateEmail,
  deleteAccount
} = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/auth");

authRoutes.post(`/register`, register);
authRoutes.post(`/login`, login);
authRoutes.post(`/logout`, authenticateUser, logout);
authRoutes.post(`/change-password`, authenticateUser, changePassword);
authRoutes.patch(`/update-email`, authenticateUser, updateEmail);
authRoutes.post(`/delete-account`, authenticateUser, deleteAccount);

module.exports = authRoutes;
