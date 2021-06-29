const User = require('./../db/models/User');

const isUserExist = async (userId) => {
  let user = undefined;

  try {
    user = await User.findById(userId);
  } catch (error) {
    return [undefined, error];
  }

  if (!user) return [user, undefined];
  return [user, undefined];
};

module.exports = { isUserExist }