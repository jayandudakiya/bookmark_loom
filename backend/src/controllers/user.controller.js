const { API_STATUS } = require('../config/api');
const useUserService = require('../services/user.service');

const getCurrentUser = async (req, res) => {
  try {
  } catch (error) {
    console.error('Error in get current user:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error.',
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userInfo = await useUserService.findUser({
      filter: { _id: userId },
    });

    if (!userInfo) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'User is not found.',
      });
    }

    const profile = {
      user_name: userInfo.user_name,
      email: userInfo.email,
      isDeleted: userInfo.isDeleted,
    };

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      profile,
    });
  } catch (error) {
    console.error('Error in get user profile:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error.',
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateBody = req.body;

    //  Prevent updates to restricted fields
    const restrictedFields = [ 'password', 'isDeleted'];
    const attemptedRestrictedUpdates = restrictedFields.filter((field) =>
      Object.prototype.hasOwnProperty.call(updateBody, field)
    );

    if (attemptedRestrictedUpdates.length > 0) {
      return res.status(400).json({
        status: API_STATUS.FAIL || 'FAIL',
        message: `You are not allowed to update: ${attemptedRestrictedUpdates.join(
          ', '
        )}`,
      });
    }

    const existingUser = await useUserService.findUser({
      filter: { _id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'User not found.',
      });
    }

    const updatedUser = await useUserService.updateUser({
      id: userId,
      updateBody,
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'User not found for update.',
      });
    }

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    console.error('Error in update user profile:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error.',
    });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
  } catch (error) {
    console.error('Error in delete user profile:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Internal server error.',
    });
  }
};
module.exports = {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
