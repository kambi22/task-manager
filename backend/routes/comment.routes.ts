import { Router } from "express";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controller";
import { validate } from "../middleware/validate";
import { createCommentSchema } from "../schemas/comment.schema";

const router = Router();

router.get("/tasks/:taskId/comments", getComments);
router.post(
  "/tasks/:taskId/comments",
  validate(createCommentSchema),
  createComment
);
router.delete("/tasks/:taskId/comments/:id", deleteComment);

export default router;
