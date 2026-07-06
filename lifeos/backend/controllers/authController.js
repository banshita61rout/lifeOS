const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const asyncHandler = require("../utils/asyncHandler");

// @desc  Register new user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

// @desc  Login
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

// @desc  Google Sign-In (client sends verified Google profile from Google Identity Services)
// @route POST /api/auth/google
const googleAuth = asyncHandler(async (req, res) => {
  const { googleId, email, name, avatar } = req.body;

  if (!googleId || !email) {
    res.status(400);
    throw new Error("Missing Google profile data");
  }

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({ googleId, email, name, avatar });
  } else if (!user.googleId) {
    user.googleId = googleId;
    await user.save();
  }

  res.json({
    success: true,
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

// @desc  Get current logged in user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

// @desc  Forgot password - generates reset token & emails (or logs) reset link
// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error("No account found with that email");
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const html = `
    <p>Hello ${user.name},</p>
    <p>You requested a password reset for your LifeOS account.</p>
    <p><a href="${resetUrl}">Click here to reset your password</a> (valid for 30 minutes).</p>
    <p>If you didn't request this, you can ignore this email.</p>
  `;

  await sendEmail({ to: user.email, subject: "LifeOS - Reset your password", html });

  res.json({ success: true, message: "Password reset link generated. Check your email (or backend console in dev mode)." });
});

// @desc  Reset password
// @route PUT /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful. Please log in." });
});

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  theme: user.theme,
});

module.exports = { register, login, googleAuth, getMe, forgotPassword, resetPassword, publicUser };
