const express = require("express");
const connectDB = require("./config/db");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

module.exports = app;
