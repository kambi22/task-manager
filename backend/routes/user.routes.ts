import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  addUsersToTeam,
} from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  updateUserSchema,
  addUsersToTeamSchema,
} from "../schemas/user.schema";

const router = Router();

router.get("/users", getUsers);
router.post("/users", validate(createUserSchema), createUser);
router.post("/users/add-to-team", validate(addUsersToTeamSchema), addUsersToTeam);
router.put("/users/:id", validate(updateUserSchema), updateUser);
router.delete("/users/:id", deleteUser);

export default router;
