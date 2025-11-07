import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(cors());
app.use(express.json());

// GET todos
app.get("/todos", async (_, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
  res.json(result.rows);
});

// POST crear tarea
app.post("/todos", async (req, res) => {
  const { task } = req.body;
  const result = await pool.query(
    "INSERT INTO todos (task) VALUES ($1) RETURNING *",
    [task]
  );
  res.json(result.rows[0]);
});

//  PUT actualizar estado
app.put("/todos/:id", async (req, res) => {
  const { done } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    "UPDATE todos SET done = $1 WHERE id = $2 RETURNING *",
    [done, id]
  );
  res.json(result.rows[0]);
});

// DELETE borrar tarea
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM todos WHERE id = $1", [id]);
  res.json({ message: "deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API corriendo en puerto ${PORT}`));
