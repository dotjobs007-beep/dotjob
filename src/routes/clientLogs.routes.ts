import { Router } from "express";
import { sendResponse } from "../utils/responseHandler";

const router = Router();

// POST /api/client/logs
// Body: { level?: 'info'|'warn'|'error', message: string, meta?: any }
router.post("/logs", (req, res) => {
  try {
    const { level = "info", message = "", meta = null } = req.body || {};
    const timestamp = new Date().toISOString();
    const entry = { timestamp, level, message, meta };

    if (level === "error") console.error("[CLIENT LOG]", entry);
    else if (level === "warn") console.warn("[CLIENT LOG]", entry);
    else console.log("[CLIENT LOG]", entry);

    return sendResponse(res, 200, "log received");
  } catch (err) {
    console.error("Failed to handle client log", err);
    return sendResponse(res, 500, "failed to handle client log");
  }
});

export default router;
