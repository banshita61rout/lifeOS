import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import api from "../api/axios";
import "./Journal.css";
import "./Tasks.css";

const moodEmoji = { great: "😄", good: "🙂", okay: "😐", bad: "🙁", awful: "😢" };

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const res = await api.get("/journal", { params: search ? { search } : {} });
    setEntries(res.data.entries);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const onCreate = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("content", data.content);
      formData.append("mood", data.mood);
      if (data.images?.length) {
        Array.from(data.images).forEach((f) => formData.append("images", f));
      }
      await api.post("/journal", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Journal entry saved");
      reset();
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save entry");
    }
  };

  const deleteEntry = async (id) => {
    await api.delete(`/journal/${id}`);
    setEntries((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <AppLayout>
      <Navbar title="Journal" />
      <div className="journal-toolbar">
        <input placeholder="🔍 Search entries..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Entry</button>
      </div>

      {loading ? <Skeleton height={200} /> : entries.length === 0 ? (
        <EmptyState icon="📔" title="No journal entries yet" subtitle="Start writing about your day" />
      ) : (
        entries.map((e) => (
          <motion.div key={e._id} className="glass-card journal-entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="journal-entry-header">
              <div>
                <span className="mood-emoji">{moodEmoji[e.mood]}</span>{" "}
                <strong>{e.title || "Untitled"}</strong>
              </div>
              <div>
                <span className="text-muted" style={{ marginRight: 10 }}>{new Date(e.date).toLocaleDateString()}</span>
                <button className="btn btn-danger btn-sm" onClick={() => deleteEntry(e._id)}>🗑️</button>
              </div>
            </div>
            <p>{e.content}</p>
            {e.images?.length > 0 && (
              <div className="journal-images">
                {e.images.map((img, i) => (
                  <img key={i} src={`http://localhost:5000${img}`} alt="attachment" />
                ))}
              </div>
            )}
          </motion.div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 style={{ marginBottom: 16 }}>New Journal Entry</h3>
            <form onSubmit={handleSubmit(onCreate)}>
              <div className="auth-field">
                <label>Title (optional)</label>
                <input {...register("title")} placeholder="Give it a title" />
              </div>
              <div className="auth-field">
                <label>How was your day?</label>
                <textarea rows={5} {...register("content", { required: true })} placeholder="Write freely..." />
              </div>
              <div className="auth-field">
                <label>Mood</label>
                <select {...register("mood")}>
                  <option value="great">😄 Great</option>
                  <option value="good">🙂 Good</option>
                  <option value="okay">😐 Okay</option>
                  <option value="bad">🙁 Bad</option>
                  <option value="awful">😢 Awful</option>
                </select>
              </div>
              <div className="auth-field">
                <label>Attach Images (optional)</label>
                <input type="file" accept="image/*" multiple {...register("images")} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Entry</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
};

export default Journal;
