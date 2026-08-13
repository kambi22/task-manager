import { Router } from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

const router = Router();

router.get("/users", getUsers);
router.post("/users", validate(createUserSchema), createUser);
router.put("/users/:id", validate(updateUserSchema), updateUser);
router.delete("/users/:id", deleteUser);

export default router;
