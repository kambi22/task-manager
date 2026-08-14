import { Router } from "express";
import { getHistory } from "../controllers/task-history.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { historyQuerySchema } from "../schemas/task-history.schema";

const router = Router();

router.get("/history", authenticate, validate(historyQuerySchema, "query"), getHistory);

export default router;
