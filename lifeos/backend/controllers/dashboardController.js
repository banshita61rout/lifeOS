const Task = require("../models/Task");
const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
const Event = require("../models/Event");
const Journal = require("../models/Journal");
const asyncHandler = require("../utils/asyncHandler");

const todayStr = () => new Date().toISOString().slice(0, 10);

// @desc Aggregate everything the Dashboard page needs in one call
// @route GET /api/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const sevenDaysAhead = new Date(startOfToday);
  sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todaysEvents,
    upcomingEvents,
    pendingTasks,
    doneTasksThisMonth,
    totalTasksThisMonth,
    habits,
    recentJournal,
  ] = await Promise.all([
    Event.find({ user: userId, start: { $gte: startOfToday, $lt: endOfToday } }).sort({ start: 1 }),
    Event.find({ user: userId, start: { $gte: endOfToday, $lt: sevenDaysAhead } }).sort({ start: 1 }).limit(5),
    Task.find({ user: userId, status: { $ne: "done" } }).sort({ dueDate: 1 }).limit(10),
    Task.countDocuments({ user: userId, status: "done", updatedAt: { $gte: startOfMonth } }),
    Task.countDocuments({ user: userId, createdAt: { $gte: startOfMonth } }),
    Habit.find({ user: userId, archived: false }),
    Journal.find({ user: userId }).sort({ date: -1 }).limit(3),
  ]);

  // Weekly productivity chart data - tasks completed per day for last 7 days
  const weekly = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(startOfToday);
    day.setDate(day.getDate() - i);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = await Task.countDocuments({
      user: userId,
      status: "done",
      updatedAt: { $gte: day, $lt: nextDay },
    });

    weekly.push({ day: day.toLocaleDateString("en-US", { weekday: "short" }), completed: count });
  }

  const habitStreaks = habits.map((h) => ({
    id: h._id,
    name: h.name,
    icon: h.icon,
    color: h.color,
    currentStreak: h.currentStreak,
    bestStreak: h.bestStreak,
  }));

  res.json({
    success: true,
    greetingName: req.user.name,
    todaysEvents,
    upcomingEvents,
    pendingTasks,
    productivity: {
      completedThisMonth: doneTasksThisMonth,
      totalThisMonth: totalTasksThisMonth,
      completionRate: totalTasksThisMonth ? Math.round((doneTasksThisMonth / totalTasksThisMonth) * 100) : 0,
    },
    weeklySummary: weekly,
    habitStreaks,
    recentJournal,
  });
});

module.exports = { getDashboard };
