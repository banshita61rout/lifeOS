const Journal = require("../models/Journal");
const asyncHandler = require("../utils/asyncHandler");

const getEntries = asyncHandler(async (req, res) => {
  const { search, mood } = req.query;
  const filter = { user: req.user._id };
  if (mood) filter.mood = mood;
  if (search) filter.$text = { $search: search };

  const entries = await Journal.find(filter).sort({ date: -1 });
  res.json({ success: true, count: entries.length, entries });
});

const createEntry = asyncHandler(async (req, res) => {
  const images = req.files ? req.files.map((f) => `/uploads/journal/${f.filename}`) : [];
  const entry = await Journal.create({ ...req.body, images, user: req.user._id });
  res.status(201).json({ success: true, entry });
});

const updateEntry = asyncHandler(async (req, res) => {
  const entry = await Journal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!entry) {
    res.status(404);
    throw new Error("Journal entry not found");
  }
  res.json({ success: true, entry });
});

const deleteEntry = asyncHandler(async (req, res) => {
  const entry = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!entry) {
    res.status(404);
    throw new Error("Journal entry not found");
  }
  res.json({ success: true, message: "Entry deleted" });
});

module.exports = { getEntries, createEntry, updateEntry, deleteEntry };
