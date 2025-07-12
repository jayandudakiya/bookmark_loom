const { API_STATUS } = require('../config/api');
const BookmarkService = require('../services/bookmark.service');

// const createBookmark = async (req, res) => {
//   try {
//     const data = {
//       ...req.body,
//       created_by_id: req.user._id,
//     };
//     const bookmark = await BookmarkService.createBookmark({ data });
//     return res.status(201).json({
//       status: API_STATUS.SUCCESS,
//       message: 'Bookmark created successfully',
//     });
//   } catch (error) {
//     console.error('Error in createBookmark:', error);
//     return res.status(500).json({
//       status: API_STATUS.ERROR,
//       message: error.message || 'Internal server error',
//     });
//   }
// };
const createBookmark = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user._id;

    // Check if this URL already exists for the current user
    const existing = await BookmarkService.getBookmarks({
      filter: { url, created_by_id: userId },
    });

    if (existing.length > 0) {
      return res.status(400).json({
        status: API_STATUS.FAIL,
        message: 'You have already added this bookmark URL.',
      });
    }

    const data = {
      ...req.body,
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
    const { id } = req.params;
    const bookmark = await BookmarkService.getBookmarkById({ id });

    if (!bookmark || String(bookmark.created_by_id) !== String(req.user._id)) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'Bookmark not found or unauthorized.',
      });
    }

    const updatedBookmark = await BookmarkService.updateBookmark({
      id,
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
    const { id } = req.params;
    const bookmark = await BookmarkService.getBookmarkById({ id });

    if (!bookmark || String(bookmark.created_by_id) !== String(req.user._id)) {
      return res.status(404).json({
        status: API_STATUS.ERROR,
        message: 'Bookmark not found or unauthorized.',
      });
    }

    await BookmarkService.deleteBookmark({ id });

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      message: 'Bookmark deleted successfully',
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
