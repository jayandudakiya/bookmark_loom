import { createSlice } from '@reduxjs/toolkit';
import {
  createBookmarkThunk,
  deleteBookmarkThunk,
  getBookmarksThunk,
  updateBookmarksThunk,
} from '@/store/thunk/bookmark.thunk';
import type { Bookmark } from '@/types/bookmark';
import { API_Response_status } from '@/types/auth';

interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  isUpdateLoading: boolean;
  isDeletingLoading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  isLoading: false,
  isUpdateLoading: false,
  isDeletingLoading: false,
  error: null,
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    resetBookmark: () => initialState,
  },
  extraReducers: (builder) => {
    // 🔽 Create
    builder.addCase(createBookmarkThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createBookmarkThunk.fulfilled, (state, { payload }) => {
      if (payload.status === API_Response_status.SUCCESS) {
        if (payload?.bookmark) state.bookmarks.push(payload?.bookmark);
        state.error = null;
      }
      state.isLoading = false;
    });
    builder.addCase(createBookmarkThunk.rejected, (state, action) => {
      state.error = action.payload?.message || 'Failed to create bookmark';
      state.isLoading = false;
    });

    // 🔽 Fetch
    builder.addCase(getBookmarksThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getBookmarksThunk.fulfilled, (state, { payload }) => {
      if (payload.status === API_Response_status.SUCCESS) {
        state.bookmarks = payload.bookmarks || [];
      }
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(getBookmarksThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Failed to fetch bookmarks';
    });

    // 🔽 Update
    builder.addCase(updateBookmarksThunk.pending, (state) => {
      state.isUpdateLoading = true;
      state.error = null;
    });
    builder.addCase(updateBookmarksThunk.fulfilled, (state, { payload }) => {
      if (payload.status === API_Response_status.SUCCESS) {
        state.bookmarks = state.bookmarks.filter(
          (b) => b._id !== payload.updatedBookmark?._id
        );
        if (payload.updatedBookmark)
          state.bookmarks.push(payload.updatedBookmark);
        // add logic for re place update item
      }
      state.error = null;
      state.isUpdateLoading = false;
    });
    builder.addCase(updateBookmarksThunk.rejected, (state, action) => {
      state.isDeletingLoading = false;
      state.error = action.payload?.message || 'Failed to delete bookmark';
    });

    // 🔽 Delete
    builder.addCase(deleteBookmarkThunk.pending, (state) => {
      state.isDeletingLoading = true;
      state.error = null;
    });
    builder.addCase(deleteBookmarkThunk.fulfilled, (state, { payload }) => {
      if (payload.status === API_Response_status.SUCCESS) {
        state.bookmarks = state.bookmarks.filter(
          (b) => b._id !== payload.deletedBookmark_id
        );
        state.error = null;
      }
      state.isDeletingLoading = false;
    });
    builder.addCase(deleteBookmarkThunk.rejected, (state, action) => {
      state.isDeletingLoading = false;
      state.error = action.payload?.message || 'Failed to delete bookmark';
    });
  },
});

export const { resetBookmark } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
