import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../schemas/user.schema";

const router = Router();

router.get("/users", getUsers);
router.post("/users", validate(createUserSchema), createUser);

export default router;
