require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true },
});


app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve locally uploaded avatar/journal images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/api/health", (req, res) => res.json({ success: true, message: "LifeOS API is running 🚀" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/journal", require("./routes/journalRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => console.log("🔌 Client disconnected:", socket.id));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 LifeOS backend running on http://localhost:${PORT}`));
