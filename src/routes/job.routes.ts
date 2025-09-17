import { Router } from "express";
import { validateAuthorization, validateBody } from "../middlewares/validator";
import JobController from "../controllers/job.controller";
import { jobSchema } from "../schema/job";
const router = Router();
const jobController = new JobController();


router.post("/post-job", validateAuthorization, validateBody(jobSchema), jobController.postJob);
router.get("/fetch-jobs", validateAuthorization, jobController.getAllJob);
router.get("/fetch-job/:jobId", validateAuthorization, jobController.getJob);
router.get("/fetch-job-by-user", validateAuthorization, jobController.getUserJob);
router.patch("/update-job/:jobId", validateAuthorization,  validateBody(jobSchema), jobController.updateJob);

export default router;
