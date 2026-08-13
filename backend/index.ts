import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import express, { Request, Response } from "express";
import cors from "cors";
import pool from "./config/db";

// Route imports
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import commentRoutes from "./routes/comment.routes";
import dashboardRoutes from "./routes/dashboard.routes";

// Middleware imports
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Health-check routes
app.get("/", (req: Request, res: Response) => {
  res.send("Task Management API is running");
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

// API routes
app.use("/api", taskRoutes);
app.use("/api", userRoutes);
app.use("/api", commentRoutes);
app.use("/api", dashboardRoutes);

// Global error handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
