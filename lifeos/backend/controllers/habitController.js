const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
const asyncHandler = require("../utils/asyncHandler");

const todayStr = () => new Date().toISOString().slice(0, 10);

const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id, archived: false }).sort({ createdAt: -1 });
  res.json({ success: true, habits });
});

const createHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, habit });
});

const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }
  res.json({ success: true, habit });
});

const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }
  await HabitLog.deleteMany({ habit: habit._id });
  res.json({ success: true, message: "Habit deleted" });
});

// @desc Toggle today's completion for a habit (used by heatmap + streak calc)
// @route POST /api/habits/:id/toggle
const toggleHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  const date = req.body.date || todayStr();
  const existing = await HabitLog.findOne({ habit: habit._id, date });

  if (existing) {
    await existing.deleteOne();
  } else {
    await HabitLog.create({ habit: habit._id, user: req.user._id, date });
  }

  // Recalculate streaks
  const logs = await HabitLog.find({ habit: habit._id }).sort({ date: -1 });
  const dateSet = new Set(logs.map((l) => l.date));

  let streak = 0;
  let cursor = new Date();
  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  habit.currentStreak = streak;
  habit.bestStreak = Math.max(habit.bestStreak, streak);
  await habit.save();

  res.json({ success: true, habit, toggledOn: !existing });
});

// @desc Get heatmap logs for the last N days (default 365) for all user habits or one habit
// @route GET /api/habits/heatmap?habitId=&days=
const getHeatmap = asyncHandler(async (req, res) => {
  const { habitId, days = 365 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - Number(days));
  const sinceStr = since.toISOString().slice(0, 10);

  const filter = { user: req.user._id, date: { $gte: sinceStr } };
  if (habitId) filter.habit = habitId;

  const logs = await HabitLog.find(filter);
  const counts = {};
  logs.forEach((l) => {
    counts[l.date] = (counts[l.date] || 0) + 1;
  });

  res.json({ success: true, heatmap: counts });
});

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, toggleHabit, getHeatmap };
