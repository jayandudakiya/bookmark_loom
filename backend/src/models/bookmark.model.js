const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    is_favorite: {
      type: Boolean,
      default: false,
    },
    created_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
bookmarkSchema.index({ url: 1, created_by_id: 1 }, { unique: true });

module.exports = mongoose.model('bookmarks', bookmarkSchema);
