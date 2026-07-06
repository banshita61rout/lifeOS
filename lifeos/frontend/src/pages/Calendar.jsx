import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import AppLayout from "../components/AppLayout";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import "./Calendar.css";
import "./Tasks.css";

const categoryColors = {
  work: "#7c5cff", personal: "#ff6b9d", health: "#22c55e",
  study: "#f59e0b", social: "#0ea5e9", other: "#94a3b8",
};

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const loadEvents = async () => {
    const res = await api.get("/events");
    setEvents(
      res.data.events.map((e) => ({
        id: e._id, title: e.title, start: e.start, end: e.end,
        allDay: e.allDay, backgroundColor: categoryColors[e.category], borderColor: categoryColors[e.category],
      }))
    );
  };

  useEffect(() => { loadEvents(); }, []);

  const onSelect = (info) => {
    setSelectedRange({ start: info.startStr, end: info.endStr });
    setShowModal(true);
  };

  const onCreate = async (data) => {
    try {
      await api.post("/events", {
        title: data.title,
        category: data.category,
        start: selectedRange.start,
        end: selectedRange.end,
      });
      toast.success("Event created");
      reset();
      setShowModal(false);
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  };

  const onEventDrop = async (info) => {
    try {
      await api.put(`/events/${info.event.id}`, {
        start: info.event.start,
        end: info.event.end || info.event.start,
      });
      toast.success("Event moved");
    } catch {
      toast.error("Failed to move event");
      info.revert();
    }
  };

  return (
    <AppLayout>
      <Navbar title="Calendar" />
      <div className="glass-card calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          selectable
          editable
          events={events}
          select={onSelect}
          eventDrop={onEventDrop}
          height="auto"
        />
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 style={{ marginBottom: 16 }}>New Event</h3>
            <form onSubmit={handleSubmit(onCreate)}>
              <div className="auth-field">
                <label>Title</label>
                <input {...register("title", { required: true })} placeholder="e.g. Team meeting" />
              </div>
              <div className="auth-field">
                <label>Category</label>
                <select {...register("category")}>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="study">Study</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </select>
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

export default CalendarPage;
