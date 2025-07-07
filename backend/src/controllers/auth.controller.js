const { API_STATUS } = require("../config/api");
const useUserService = require("../services/user.service");
const {
  deleteUserWithDependencies,
} = require("../services/userCleanup.service");
const { comparePassword, hashPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    // 🛑 Validation
    if (!user_name || !email || !password) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: "Full name, email, and password are required.",
      });
    }

    // 🔍 Check existing user
    const existingUser = await useUserService.findUser({
      filter: {
        email,
        isDeleted: false,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: API_STATUS.FAIL,
        message: "A user with this email already exists.",
      });
    }

    // ✅ Create user
    const newUser = await useUserService.createUser({
      newUserData: {
        email,
        user_name,
        password,
      },
    });

    if (!newUser) {
      return res.status(500).json({
        status: API_STATUS.ERROR,
        message: "Something went wrong while creating the user.",
      });
    }

    const token = await generateToken({
      payload: {
        uid: newUser._id,
      },
    });

    if (!token) {
      return res.status(500).json({
        status: API_STATUS.ERROR,
        message: "Failed to generate authentication token.",
      });
    }

    return res.status(201).json({
      status: API_STATUS.SUCCESS,
      message: "User created successfully.",
      token: token,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || "Internal server error.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, user_name, password } = req.body;

    // 🛑 Validation
    if (!password || (!email && !user_name)) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: "Password and either email or full name are required.",
      });
    }

    const filter = {
      isDeleted: false,
      ...(email ? { email } : { user_name }),
    };

    // 🔎 Find user
    const user = await useUserService.findUser({ filter });

    if (!user) {
      return res.status(401).json({
        status: API_STATUS.FAIL,
        message: "invalid full name , email Or password credentials.",
      });
    }

    const isMatch = await comparePassword({
      rawPassword: password,
      hashedPassword: user.password,
    });

    if (!isMatch) {
      return res.status(401).json({
        status: API_STATUS.FAIL,
        message: "invalid full name , email Or password credentials.",
      });
    }

    // ✅ Generate token
    const token = await generateToken({
      payload: { uid: user._id },
    });
    if (!token) {
      return res.status(500).json({
        status: API_STATUS.ERROR,
        message: "Failed to generate token.",
      });
    }

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || "Internal server error.",
    });
  }
};
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || "Internal server error.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: "Old and new passwords are required.",
      });
    }

    const user = await useUserService.findUser({
      filter: { _id: userId, isDeleted: false },
    });
    if (!user) {
      return res.status(404).json({
        status: API_STATUS.FAIL,
        message: "User not found.",
      });
    }

    const isMatch = await comparePassword({
      rawPassword: oldPassword,
      hashedPassword: user.password,
    });

    if (!isMatch) {
      return res.status(401).json({
        status: API_STATUS.FAIL,
        message: "Old password is incorrect.",
      });
    }

    const hashedNewPassword = await hashPassword({ password: newPassword });

    await useUserService.updateUser({
      id: userId,
      updateBody: { password: hashedNewPassword },
    });

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Change Password Error:", err.message);
    return res
      .status(500)
      .json({ status: API_STATUS.ERROR, message: err.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: "New email is required.",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: "Invalid email format.",
      });
    }

    const existingUser = await useUserService.findUser({
      filter: { email: newEmail, isDeleted: false },
    });

    if (existingUser) {
      return res.status(409).json({
        status: API_STATUS.FAIL,
        message: "Email already in use.",
      });
    }

    const updatedUser = await useUserService.updateUser({
      id: userId,
      updateBody: { email: newEmail },
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: API_STATUS.FAIL,
        message: "User not found or email update failed.",
      });
    }

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: "Email updated successfully.",
    });
  } catch (err) {
    console.error("Update Email Error:", err.message);
    return res
      .status(500)
      .json({ status: API_STATUS.ERROR, message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: "User ID missing from request context.",
      });
    }

    const result = await deleteUserWithDependencies({ userId });

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: "Account and related data permanently deleted.",
      meta: result,
    });
  } catch (err) {
    console.error("Delete Account Error:", err.message);
    return res
      .status(500)
      .json({ status: API_STATUS.ERROR, message: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
  updateEmail,
  deleteAccount,
};
