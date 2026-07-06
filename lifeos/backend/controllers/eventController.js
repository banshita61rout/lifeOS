const Event = require("../models/Event");
const asyncHandler = require("../utils/asyncHandler");

const getEvents = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const filter = { user: req.user._id };
  if (start && end) {
    filter.start = { $gte: new Date(start) };
    filter.end = { $lte: new Date(end) };
  }
  const events = await Event.find(filter).sort({ start: 1 });
  res.json({ success: true, events });
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ success: true, event });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ success: true, message: "Event deleted" });
});

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
