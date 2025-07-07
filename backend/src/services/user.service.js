const User = require("../models/user.model");
const { hashPassword } = require("../utils/hash");

class useUserService {
  async createUser({ newUserData }) {
    try {
      // const hashedPassword = bcrypt.hashSync(newUserData.password, saltRounds);
      const hashedPassword = await hashPassword({
        password: newUserData.password,
      });
      const user = await User.create({
        ...newUserData,
        password: hashedPassword,
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      console.error("Service Error creating user:", err.message);
      throw err;
    }
  }
  async findUser({ filter = {} }) {
    try {
      const user = await User.findOne(filter);
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      console.error("Service Error finding user:", err.message);
      throw err;
    }
  }
  async updateUser({ id, updateBody = {} }) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateBody, {
        new: true,
      });

      if (!updatedUser) {
        return null;
      }

      return updatedUser;
    } catch (err) {
      console.error("Service Error updating user:", err.message);
      throw err;
    }
  }
  async deleteUser({ id }) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new Error("User not found for deletion");
      }

      return deletedUser;
    } catch (err) {
      console.error("Service Error deleting user:", err.message);
      throw err;
    }
  }
}

module.exports = new useUserService();
