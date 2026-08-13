import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import express, { Request, Response } from "express";
import cors from "cors";
import pool from "./db";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Task received successfully");
});

app.get("/connect", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "PostgreSQL connected successfully",
      time: result.rows[0].now,
    });
  } catch (error: any) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.post("/", (req: Request, res: Response) => {
  const task = req.body.task;

  console.log(task);
  res.json({ message: "Task received successfully", task });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
