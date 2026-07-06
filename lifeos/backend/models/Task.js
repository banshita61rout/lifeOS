const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: [true, "Task title is required"], trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    dueDate: { type: Date },
    timeBlockStart: { type: Date },
    timeBlockEnd: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
