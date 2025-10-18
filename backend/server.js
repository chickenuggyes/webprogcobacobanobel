import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Routes & Controllers
import authRoutes from "./routes/authRoutes.js";
import itemsRoutes from "./routes/mainMenuRoutes.js";
import reportRoutes from "./routes/report.js";
import debugRoutes from "./routes/debugRoutes.js"; // ✅ Tambahan route debug
import { dashboard } from "./controllers/report.js";

dotenv.config();

// Untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan folder uploads tersedia
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

/* ---------- Global Middleware ---------- */
app.set("trust proxy", 1); // penting untuk Railway
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ---------- Static Files ---------- */
app.use("/uploads", express.static(uploadsDir)); // file upload
app.use("/src", express.static(path.join(__dirname, "../src"))); // halaman login
app.use("/dist", express.static(path.join(__dirname, "../dist"))); // dashboard

/* ---------- Routes ---------- */
app.use("/login", authRoutes);
app.use("/items", itemsRoutes);
app.use("/report", reportRoutes);
app.use("/debug", debugRoutes); // ✅ Tambahan route debug untuk cek database

// Ringkasan dashboard
app.get("/dashboard", dashboard);

// Healthcheck untuk Railway
app.get("/healthz", (req, res) => res.json({ ok: true }));

// Default route (redirect ke login page)
app.get("/", (req, res) => {
  res.redirect("/src/login.html");
});

/* ---------- Error Handler ---------- */
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
