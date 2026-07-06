const express = require("express");
const router = express.Router();
const { updateProfile, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload");

router.put("/me", protect, uploadAvatar.single("avatar"), updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
