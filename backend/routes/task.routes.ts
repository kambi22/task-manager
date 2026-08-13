import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { validate } from "../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../schemas/task.schema";

const router = Router();

router.get("/tasks", validate(taskQuerySchema, "query"), getTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", validate(createTaskSchema), createTask);
router.put("/tasks/:id", validate(updateTaskSchema), updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
