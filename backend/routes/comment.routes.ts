import { Router } from "express";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { createCommentSchema } from "../schemas/comment.schema";

const router = Router();

router.get("/tasks/:taskId/comments", authenticate, getComments);
router.post(
  "/tasks/:taskId/comments",
  authenticate,
  validate(createCommentSchema),
  createComment
);
router.delete("/tasks/:taskId/comments/:id", authenticate, deleteComment);

export default router;

