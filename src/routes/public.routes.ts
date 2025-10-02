import { Router } from "express";
import PublicController from "../controllers/public.controller";
const router = Router();
const publicController = new PublicController();

router.get("/jobs", publicController.getAllJob);
router.get("/users", publicController.fetchUsers);

export default router;
