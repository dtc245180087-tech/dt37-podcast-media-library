const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "podcast_library",
  user: process.env.DB_USER || "podcast_app",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "podcast-api", database: "connected" });
  } catch (_error) {
    res.status(503).json({ status: "degraded", service: "podcast-api", database: "unavailable" });
  }
});

app.get("/api/categories", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT c.id, c.name, COUNT(e.id) AS episode_count FROM categories c LEFT JOIN episodes e ON e.category_id = c.id GROUP BY c.id, c.name ORDER BY c.name"
    );
    res.json(rows);
  } catch (error) {
    console.error("categories query failed:", error.message);
    res.status(500).json({ error: "Không thể tải danh mục." });
  }
});

app.get("/api/episodes", async (req, res) => {
  const search = String(req.query.search || "").trim().slice(0, 100);
  const category = String(req.query.category || "").trim().slice(0, 80);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit || "50", 10) || 50, 1), 100);
  try {
    const where = [];
    const params = [];
    if (search) {
      where.push("(e.title LIKE ? OR e.description LIKE ? OR e.host LIKE ? OR c.name LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    if (category && category !== "Tất cả") {
      where.push("c.name = ?");
      params.push(category);
    }
    const sql = `SELECT e.id, e.title, e.description, e.host, e.duration, e.cover_theme, e.audio_url, c.name AS category
      FROM episodes e JOIN categories c ON c.id=e.category_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY e.created_at DESC, e.id ASC LIMIT ?`;
    params.push(limit);
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("episodes query failed:", error.message);
    res.status(500).json({ error: "Không thể tải danh sách podcast." });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => console.log(`podcast-api listening on ${port}`));
