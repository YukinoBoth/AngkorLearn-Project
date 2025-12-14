import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
  "https://angkor-learn-project.vercel.app",
  "http://localhost:5173"   // optional for local development
]
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Connect Database
connectDB();

app.post("/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => res.send("Backend is running!"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
