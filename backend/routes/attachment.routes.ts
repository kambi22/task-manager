import { Router } from "express";
import {
  uploadAttachment,
  deleteAttachment,
} from "../controllers/attachment.controller";
import { upload } from "../middleware/upload";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/tasks/:taskId/attachments",
  authenticate,
  upload.single("file"),
  uploadAttachment
);

router.delete(
  "/tasks/:taskId/attachments/:id",
  authenticate,
  deleteAttachment
);

export default router;
