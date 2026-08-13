import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  addUsersToTeam,
} from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";
import {
  createUserSchema,
  updateUserSchema,
  addUsersToTeamSchema,
} from "../schemas/user.schema";

const router = Router();

router.get("/users", authenticate, getUsers);
router.post("/users", authenticate, authorize(["ADMIN"]), validate(createUserSchema), createUser);
router.post("/users/add-to-team", authenticate, authorize(["ADMIN"]), validate(addUsersToTeamSchema), addUsersToTeam);
router.put("/users/:id", authenticate, authorize(["ADMIN"]), validate(updateUserSchema), updateUser);
router.delete("/users/:id", authenticate, authorize(["ADMIN"]), deleteUser);

export default router;
