import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import AppLayout from "../components/AppLayout";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import api from "../api/axios";
import "./Tasks.css";

const columns = [
  { key: "todo", label: "📋 To Do" },
  { key: "in-progress", label: "🚧 In Progress" },
  { key: "done", label: "✅ Done" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await api.get("/tasks", { params });
      setTasks(res.data.tasks);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [search, priorityFilter]);

  const onCreate = async (data) => {
    try {
      await api.post("/tasks", data);
      toast.success("Task created");
      reset();
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  const moveTask = async (task, newStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
    } catch {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <AppLayout>
      <Navbar title="Task Manager" />
      <div className="task-toolbar">
        <input placeholder="🔍 Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
      </div>

      {loading ? (
        <Skeleton height={300} />
      ) : (
        <div className="kanban">
          {columns.map((col) => (
            <div className="glass-card kanban-col" key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("taskId");
                const task = tasks.find((t) => t._id === id);
                if (task) moveTask(task, col.key);
              }}
            >
              <h4>{col.label} <span className="text-muted">{tasks.filter((t) => t.status === col.key).length}</span></h4>
              <AnimatePresence>
                {tasks.filter((t) => t.status === col.key).length === 0 && <EmptyState title="Empty" icon="📭" />}
                {tasks.filter((t) => t.status === col.key).map((t) => (
                  <motion.div
                    key={t._id}
                    className="task-card"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("taskId", t._id)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h5>{t.title}</h5>
                    {t.dueDate && <div className="text-muted" style={{ fontSize: 12 }}>Due {new Date(t.dueDate).toLocaleDateString()}</div>}
                    <div className="task-card-meta">
                      <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                      <span className="text-muted">{t.category}</span>
                    </div>
                    <div className="task-actions">
                      {columns.filter((c) => c.key !== t.status).map((c) => (
                        <button key={c.key} className="btn btn-outline btn-sm" onClick={() => moveTask(t, c.key)}>{c.label.split(" ")[0]}</button>
                      ))}
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTask(t._id)}>🗑️</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 style={{ marginBottom: 16 }}>New Task</h3>
            <form onSubmit={handleSubmit(onCreate)}>
              <div className="auth-field">
                <label>Title</label>
                <input {...register("title", { required: true })} placeholder="Task title" />
              </div>
              <div className="auth-field">
                <label>Description</label>
                <textarea rows={3} {...register("description")} placeholder="Optional details" />
              </div>
              <div className="grid grid-2">
                <div className="auth-field">
                  <label>Priority</label>
                  <select {...register("priority")}>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="auth-field">
                  <label>Category</label>
                  <input {...register("category")} placeholder="e.g. Work" />
                </div>
              </div>
              <div className="auth-field">
                <label>Due Date</label>
                <input type="date" {...register("dueDate")} />
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

export default Tasks;
