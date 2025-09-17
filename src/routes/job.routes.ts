import { Router } from "express";
import { validateAuthorization, validateBody } from "../middlewares/validator";
import JobController from "../controllers/job.controller";
import { jobSchema } from "../schema/job";
const router = Router();
const jobController = new JobController();


router.post("/post-job", validateAuthorization, validateBody(jobSchema), jobController.postJob);
router.get("/fetch-jobs", validateAuthorization, jobController.getJob);

export default router;
