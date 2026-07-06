import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import api from "../api/axios";
import "./Habits.css";

const todayStr = () => new Date().toISOString().slice(0, 10);

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [heatmap, setHeatmap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const [hRes, mRes] = await Promise.all([api.get("/habits"), api.get("/habits/heatmap")]);
    setHabits(hRes.data.habits);
    setHeatmap(mRes.data.heatmap);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (data) => {
    try {
      await api.post("/habits", data);
      toast.success("Habit created 🔥");
      reset();
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create habit");
    }
  };

  const toggle = async (habit) => {
    try {
      const res = await api.post(`/habits/${habit._id}/toggle`, { date: todayStr() });
      setHabits((prev) => prev.map((h) => (h._id === habit._id ? res.data.habit : h)));
      toast.success(res.data.toggledOn ? "Marked done for today!" : "Unmarked for today");
      load();
    } catch {
      toast.error("Failed to update habit");
    }
  };

  const deleteHabit = async (id) => {
    await api.delete(`/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h._id !== id));
  };

  // Build last-90-day grid for the combined heatmap
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const intensity = (count) => {
    if (!count) return "var(--border)";
    if (count === 1) return "#bda6ff";
    if (count === 2) return "#8f6bff";
    return "#5f3dfc";
  };

  return (
    <AppLayout>
      <Navbar title="Habit Tracker" />
      <div className="habits-toolbar">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Habit</button>
      </div>

      <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 10 }}>📅 90-Day Contribution Heatmap</h3>
        {loading ? <Skeleton height={80} /> : (
          <div className="heatmap-grid">
            {days.map((d) => (
              <div key={d} className="heatmap-cell" title={`${d}: ${heatmap[d] || 0} habit(s) done`} style={{ background: intensity(heatmap[d]) }} />
            ))}
          </div>
        )}
      </div>

      {loading ? <Skeleton height={200} /> : habits.length === 0 ? (
        <EmptyState icon="🔥" title="No habits yet" subtitle="Create your first habit to start building a streak" />
      ) : (
        habits.map((h) => (
          <motion.div key={h._id} className="glass-card habit-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="habit-emoji">{h.icon}</span>
            <div className="habit-info">
              <h4>{h.name}</h4>
              <div className="habit-streaks">
                <span>🔥 Current: {h.currentStreak}</span>
                <span>🏆 Best: {h.bestStreak}</span>
              </div>
            </div>
            <button className={"check-btn" + (heatmap[todayStr()] ? "" : "")} onClick={() => toggle(h)}>✓</button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteHabit(h._id)}>🗑️</button>
          </motion.div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 style={{ marginBottom: 16 }}>New Habit</h3>
            <form onSubmit={handleSubmit(onCreate)}>
              <div className="auth-field">
                <label>Name</label>
                <input {...register("name", { required: true })} placeholder="e.g. Drink water" />
              </div>
              <div className="auth-field">
                <label>Icon (emoji)</label>
                <input {...register("icon")} placeholder="💧" defaultValue="✅" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
};

export default Habits;
