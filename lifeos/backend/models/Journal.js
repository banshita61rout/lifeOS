const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "" },
    content: { type: String, required: true },
    mood: { type: String, enum: ["great", "good", "okay", "bad", "awful"], default: "okay" },
    images: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

journalSchema.index({ content: "text", title: "text" });

module.exports = mongoose.model("Journal", journalSchema);
