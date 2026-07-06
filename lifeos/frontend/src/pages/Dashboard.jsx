import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AppLayout from "../components/AppLayout";
import Navbar from "../components/Navbar";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppLayout>
      <Navbar title="Dashboard" />
      <div className="page-container" style={{ padding: 0 }}>
        <motion.div className="greeting-card glass-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1>{greeting}, {user?.name?.split(" ")[0]} 👋</h1>
          <p>Here's what's on your plate today.</p>
          {!loading && data && (
            <div className="stat-row">
              <span className="stat-pill">📅 {data.todaysEvents.length} events today</span>
              <span className="stat-pill">✅ {data.pendingTasks.length} pending tasks</span>
              <span className="stat-pill">📈 {data.productivity.completionRate}% done this month</span>
            </div>
          )}
        </motion.div>

        <div className="grid grid-3 dash-grid">
          <motion.div className="glass-card dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3>🗓️ Today's Schedule</h3>
            {loading ? <Skeleton height={80} /> : data.todaysEvents.length ? (
              data.todaysEvents.map((e) => (
                <div className="list-item" key={e._id}>
                  <span>{e.title}</span>
                  <span className="text-muted">{new Date(e.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))
            ) : <EmptyState icon="🗓️" title="No events today" subtitle="Enjoy your free day!" />}
          </motion.div>

          <motion.div className="glass-card dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <h3>⏳ Pending Tasks</h3>
            {loading ? <Skeleton height={80} /> : data.pendingTasks.length ? (
              data.pendingTasks.slice(0, 5).map((t) => (
                <div className="list-item" key={t._id}>
                  <span>{t.title}</span>
                  <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                </div>
              ))
            ) : <EmptyState icon="✅" title="All caught up!" />}
          </motion.div>

          <motion.div className="glass-card dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3>🔥 Habit Streaks</h3>
            {loading ? <Skeleton height={80} /> : data.habitStreaks.length ? (
              data.habitStreaks.map((h) => (
                <div className="habit-chip" key={h.id}>
                  <span>{h.icon}</span>
                  <span>{h.name}</span>
                  <span className="streak">{h.currentStreak}🔥</span>
                </div>
              ))
            ) : <EmptyState icon="🔥" title="No habits yet" subtitle="Create one to start a streak" />}
          </motion.div>
        </div>

        <div className="grid grid-2">
          <motion.div className="glass-card dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <h3>📊 Weekly Productivity</h3>
            {loading ? <Skeleton height={220} /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.weeklySummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="completed" fill="#7c5cff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div className="glass-card dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3>📔 Recent Journal Entries</h3>
            {loading ? <Skeleton height={220} /> : data.recentJournal.length ? (
              data.recentJournal.map((j) => (
                <div className="list-item" key={j._id}>
                  <span>{j.title || j.content.slice(0, 40)}</span>
                  <span className="text-muted">{new Date(j.date).toLocaleDateString()}</span>
                </div>
              ))
            ) : <EmptyState icon="📔" title="No journal entries" subtitle="Write your first one today" />}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
