const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { publicUser } = require("./authController");

// @desc Update profile (name, theme)
// @route PUT /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const { name, theme } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (theme) user.theme = theme;

  if (req.file) {
    user.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  await user.save();
  res.json({ success: true, user: publicUser(user) });
});

// @desc Change password (while logged in)
// @route PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated" });
});

module.exports = { updateProfile, changePassword };
