const jwt = require("jsonwebtoken");

const generateToken = async ({ payload, options = {} }) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || "1d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) {
        console.error("Token generation failed:", err.message);
        return reject(new Error("Failed to generate token"));
      }
      resolve(token);
    });
  });
};

const verifyToken = async ({ token }) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err.message);
        return reject(new Error("Invalid or expired token"));
      }
      resolve(decoded);
    });
  });
};
module.exports = {
  generateToken,
  verifyToken,
};
