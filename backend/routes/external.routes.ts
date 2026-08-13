import { Router } from "express";
import { getExternalUsers } from "../controllers/external.controller";

const router = Router();

router.get("/external/users", getExternalUsers);

export default router;
