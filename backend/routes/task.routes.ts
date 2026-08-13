import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../schemas/task.schema";

const router = Router();

router.get("/tasks", authenticate, validate(taskQuerySchema, "query"), getTasks);
router.get("/tasks/:id", authenticate, getTaskById);
router.post("/tasks", authenticate, validate(createTaskSchema), createTask);
router.put("/tasks/:id", authenticate, validate(updateTaskSchema), updateTask);
router.delete("/tasks/:id", authenticate, authorize(["ADMIN"]), deleteTask);

export default router;

