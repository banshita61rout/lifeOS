const express = require("express");
const router = express.Router();
const { getEntries, createEntry, updateEntry, deleteEntry } = require("../controllers/journalController");
const { protect } = require("../middleware/auth");
const { uploadJournalImage } = require("../middleware/upload");

router.use(protect);
router.route("/").get(getEntries).post(uploadJournalImage.array("images", 5), createEntry);
router.route("/:id").put(updateEntry).delete(deleteEntry);

module.exports = router;
