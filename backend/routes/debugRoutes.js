// backend/routes/debugRoutes.js
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const router = Router();

// Wajib set di ENV (Railway → Settings → Variables)
const ADMIN_KEY = process.env.ADMIN_KEY || "";

// Lokasi file JSON kamu
const USERS_PATH = path.join(__dirname, "../data/users.json");
const ITEMS_PATH = path.join(__dirname, "../data/items.json");

// Middleware kecil: hanya boleh akses kalau query ?key=ADMIN_KEY
function guard(req, res, next) {
  if (!ADMIN_KEY || req.query.key !== ADMIN_KEY) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

router.get("/", guard, (req, res) => {
  res.json({ ok: true, endpoints: ["/debug/users", "/debug/items"] });
});

router.get("/users", guard, (req, res) => {
  if (!fs.existsSync(USERS_PATH)) return res.json({ users: [] });
  const raw = fs.readFileSync(USERS_PATH, "utf8") || "{}";
  // kirim apa adanya biar struktur asli terlihat
  res.type("application/json").send(raw);
});

router.get("/items", guard, (req, res) => {
  if (!fs.existsSync(ITEMS_PATH)) return res.json({ items: [] });
  const raw = fs.readFileSync(ITEMS_PATH, "utf8") || "{}";
  res.type("application/json").send(raw);
});

export default router;
