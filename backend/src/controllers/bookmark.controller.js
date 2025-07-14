const { API_STATUS } = require('../config/api');
const BookmarkService = require('../services/bookmark.service');
const UserService = require('../services/user.service');

const createBookmark = async (req, res) => {
  try {
    const { name, url, category, description } = req.body;
    const userId = req.user?._id;

    // 🧾 Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!url) missingFields.push('url');
    if (!category) missingFields.push('category');

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // 🔐 Check for valid user
    if (!userId) {
      return res.status(401).json({
        status: API_STATUS.ERROR,
        message: 'Unauthorized: user ID not found in request.',
      });
    }

    const user = await UserService.findUser({ filter: { _id: userId } });
    if (!user) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'User not found.',
      });
    }

    // 🔁 Check for duplicate URL
    const existing = await BookmarkService.getBookmarks({
      filter: { url, created_by_id: userId },
    });

    if (existing.length > 0) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: 'You have already added this bookmark URL.',
      });
    }

    // ✅ Create bookmark
    const data = {
      name,
      url,
      category,
      description: description || '',
      created_by_id: userId,
    };

    const bookmark = await BookmarkService.createBookmark({ data });

    return res.status(201).json({
      status: API_STATUS.SUCCESS,
      message: 'Bookmark created successfully',
      bookmark,
    });
  } catch (error) {
    console.error('Error in createBookmark:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error',
    });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await BookmarkService.getBookmarks({
      filter: { created_by_id: req.user._id },
    });
    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      bookmarks,
    });
  } catch (error) {
    console.error('Error in getBookmarks:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error',
    });
  }
};

const getBookmarkById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmark = await BookmarkService.getBookmarkById({ id });

    if (!bookmark || String(bookmark.created_by_id) !== String(req.user._id)) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'Bookmark not found or unauthorized access.',
      });
    }

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      bookmark,
    });
  } catch (error) {
    console.error('Error in getBookmarkById:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error',
    });
  }
};
const updateBookmark = async (req, res) => {
  try {
    const { name, url, category, description, is_favorite, _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        message: `bookmark id is required to update bookmark`,
      });
    }

    // Track missing fields
    const missingFields = [];

    if (name === undefined) missingFields.push('name');
    if (url === undefined) missingFields.push('url');
    if (category === undefined) missingFields.push('category');
    if (description === undefined) missingFields.push('description');
    if (typeof is_favorite !== 'boolean' && is_favorite === undefined)
      missingFields.push('is_favorite');

    // If all fields are missing
    if (missingFields.length === 5) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        message: `At least one field must be provided to update. Missing: ${missingFields.join(
          ', '
        )}`,
      });
    }

    const bookmark = await BookmarkService.getBookmarkById({ id: _id });

    if (!bookmark || String(bookmark.created_by_id) !== String(req.user._id)) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'Bookmark not found or unauthorized.',
      });
    }

    const updatedBookmark = await BookmarkService.updateBookmark({
      id: _id,
      updateData: req.body,
    });

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: 'Bookmark updated successfully',
      updatedBookmark,
    });
  } catch (error) {
    console.error('Error in updateBookmark:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error',
    });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const { _id } = req.body; // ✅ Get ID from request body

    // ✅ Validate the _id field
    if (!_id || typeof _id !== 'string') {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        message: 'Invalid or missing _id field in request body.',
      });
    }

    const bookmark = await BookmarkService.getBookmarkById({ id: _id });

    if (!bookmark || String(bookmark.created_by_id) !== String(req.user._id)) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'Bookmark not found or unauthorized.',
      });
    }

    const deleted_bookmark = await BookmarkService.deleteBookmark({ id: _id });

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: 'Bookmark deleted successfully',
      deletedBookmark_id: deleted_bookmark._id || _id,
    });
  } catch (error) {
    console.error('Error in deleteBookmark:', error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      message: error.message || 'Internal server error',
    });
  }
};


module.exports = {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
};
