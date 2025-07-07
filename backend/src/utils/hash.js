const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
exports.hashPassword = async ({ password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error("Service Error hashing password:", err.message);
    throw new Error("Password hashing failed");
  }
};

exports.comparePassword = async ({ rawPassword, hashedPassword }) => {
  try {
    const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
    return isMatch;
  } catch (err) {
    console.error("Service Error comparing passwords:", err.message);
    return false;
  }
};
