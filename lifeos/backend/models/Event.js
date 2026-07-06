const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    allDay: { type: Boolean, default: false },
    category: { type: String, enum: ["work", "personal", "health", "study", "social", "other"], default: "other" },
    color: { type: String, default: "#7c5cff" },
    recurrence: { type: String, enum: ["none", "daily", "weekly", "monthly"], default: "none" },
    reminderMinutesBefore: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
