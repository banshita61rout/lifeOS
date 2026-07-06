const express = require("express");
const router = express.Router();
const {
  getHabits, createHabit, updateHabit, deleteHabit, toggleHabit, getHeatmap,
} = require("../controllers/habitController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/heatmap", getHeatmap);
router.route("/").get(getHabits).post(createHabit);
router.route("/:id").put(updateHabit).delete(deleteHabit);
router.post("/:id/toggle", toggleHabit);

module.exports = router;
