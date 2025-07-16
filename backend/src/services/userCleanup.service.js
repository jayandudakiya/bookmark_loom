const useUserService = require('./user.service');
const bookmarkService = require('./bookmark.service');

async function deleteUserWithDependencies({ userId }) {
  const user = await useUserService.findUser({ filter: { _id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  // 1. Delete all bookmarks created by this user
  try {
    const { deletedCount } = await bookmarkService.deleteManyBookmarks({
      filter: { created_by_id: userId },
    });

    console.log(`Deleted ${deletedCount} bookmarks for user ${userId}`);
  } catch (error) {
    console.error(
      `Failed to delete bookmarks for user ${userId}:`,
      error.message
    );
    throw new Error('Error deleting user bookmarks');
  }

  // 2. Delete the user
  const deletedUser = await useUserService.deleteUser({ id: userId });

  return {
    userId,
    userDeleted: !!deletedUser,
    bookmarksDeleted: true,
  };
}

module.exports = {
  deleteUserWithDependencies,
};
