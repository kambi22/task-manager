import { Router } from "express";
import { getExternalUsers } from "../controllers/external.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/external/users", authenticate, authorize(["ADMIN"]), getExternalUsers);

export default router;
