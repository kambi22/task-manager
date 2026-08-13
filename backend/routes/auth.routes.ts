import { Router } from "express";
import { signup, login, getMe } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { signupSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/auth/signup", validate(signupSchema), signup);
router.post("/auth/login", validate(loginSchema), login);
router.get("/auth/me", authenticate, getMe);

export default router;
