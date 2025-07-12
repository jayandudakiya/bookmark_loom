const express = require('express');
const { authenticateUser } = require('../middlewares/auth');
const {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
} = require('../controllers/bookmark.controller');

const bookmarkRoutes = express.Router();

bookmarkRoutes.post('/create', authenticateUser, createBookmark);
bookmarkRoutes.get('/list', authenticateUser, getBookmarks);
bookmarkRoutes.post('/update', authenticateUser, updateBookmark);
bookmarkRoutes.post('/delete', authenticateUser, deleteBookmark);
bookmarkRoutes.get('/:id', authenticateUser, getBookmarkById);

module.exports = bookmarkRoutes;
