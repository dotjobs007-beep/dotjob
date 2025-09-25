import { Router } from "express";
import { validateBody } from "../middlewares/validator";
import JobController from "../controllers/job.controller";
import { jobApplicationSchema, jobSchema } from "../schema/job";
const router = Router();
const jobController = new JobController();

router.post("/post-job", validateBody(jobSchema), jobController.postJob);
router.get("/fetch-jobs", jobController.getAllJob);
router.get("/fetch-job/:jobId", jobController.getJob);
router.get("/fetch-job-by-user", jobController.getUserJob);
router.patch(
  "/update-job/:jobId",
  validateBody(jobSchema),
  jobController.updateJob
);
router.post(
  "/job-application",
  validateBody(jobApplicationSchema),
  jobController.applyForJob
);

router.get(
  "/get-applications-for-job/:jobId",
  jobController.getApplicationsForJob
);
router.patch(
  "/update-job-application",
  validateBody(jobApplicationSchema),
  jobController.updateApplicationStatus
);


router.post(
  "/upload-file",
  jobController.uploadResume
);

export default router;
