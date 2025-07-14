const useUserService = require('./user.service');

async function deleteUserWithDependencies({ userId }) {
  const user = await useUserService.findUser({ filter: { _id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  // 3. Delete the user
  const deletedUser = await useUserService.deleteUser({ id: userId });

  return {
    userId,
    userDeleted: !!deletedUser,
  };
}

module.exports = {
  deleteUserWithDependencies,
};
