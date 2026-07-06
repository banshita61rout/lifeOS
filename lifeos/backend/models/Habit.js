const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "✅" },
    color: { type: String, default: "#7c5cff" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
