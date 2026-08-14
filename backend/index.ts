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
import externalRoutes from "./routes/external.routes";
import authRoutes from "./routes/auth.routes";
import taskHistoryRoutes from "./routes/task-history.routes";
import attachmentRoutes from "./routes/attachment.routes";
import auditLogRoutes from "./routes/audit-log.routes";

// Middleware imports
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-iqg8.vercel.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const isLocalhost = origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
      if (allowedOrigins.includes(origin) || isLocalhost) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api", externalRoutes);
app.use("/api", authRoutes);
app.use("/api", taskHistoryRoutes);
app.use("/api", attachmentRoutes);
app.use("/api", auditLogRoutes);


// Global error handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
