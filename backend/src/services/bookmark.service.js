const Bookmark = require('../models/bookmark.model');

class BookmarkService {
  async createBookmark({ data }) {
    try {
      const bookmark = await Bookmark.create(data);
      return bookmark;
    } catch (error) {
      console.error('Service Error creating bookmark:', error.message);
      throw error;
    }
  }

  async getBookmarks({ filter = {} }) {
    try {
      const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
      return bookmarks;
    } catch (error) {
      console.error('Service Error getting bookmarks:', error.message);
      throw error;
    }
  }

  async getBookmarkById({ id }) {
    try {
      const bookmark = await Bookmark.findById(id);
      return bookmark;
    } catch (error) {
      console.error('Service Error getting bookmark by ID:', error.message);
      throw error;
    }
  }

  async updateBookmark({ id, updateData }) {
    try {
      const updatedBookmark = await Bookmark.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      return updatedBookmark;
    } catch (error) {
      console.error('Service Error updating bookmark:', error.message);
      throw error;
    }
  }

  async deleteBookmark({ id }) {
    try {
      const deletedBookmark = await Bookmark.findByIdAndDelete(id);
      return deletedBookmark;
    } catch (error) {
      console.error('Service Error deleting bookmark:', error.message);
      throw error;
    }
  }
  async deleteManyBookmarks({ filter = {} }) {
    try {
      const result = await Bookmark.deleteMany(filter);
      return result; // contains { deletedCount: N }
    } catch (error) {
      console.error('Service Error deleting many bookmarks:', error.message);
      throw error;
    }
  }
}

module.exports = new BookmarkService();
