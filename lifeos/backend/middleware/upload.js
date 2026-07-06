const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Local disk storage (100% free, no Cloudinary key required)
const makeStorage = (subfolder) => {
  const dir = path.join(__dirname, "..", "uploads", subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${req.user ? req.user._id : "anon"}-${Date.now()}${ext}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const uploadAvatar = multer({ storage: makeStorage("avatars"), fileFilter, limits: { fileSize: 3 * 1024 * 1024 } });
const uploadJournalImage = multer({ storage: makeStorage("journal"), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadAvatar, uploadJournalImage };
