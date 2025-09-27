import { Router } from "express";
import { sendResponse } from "../utils/responseHandler";

// Import Sentry if available via global (app.ts sets it)
let Sentry: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Sentry = require("@sentry/node");
} catch (_e) {
  Sentry = null;
}

const router = Router();

// POST /api/client/logs
// Body: { level?: 'info'|'warn'|'error', message: string, meta?: any }
router.post("/logs", (req, res) => {
  try {
    const { level = "info", message = "", meta = null } = req.body || {};
    const timestamp = new Date().toISOString();
    const entry = { timestamp, level, message, meta };

    if (level === "error") {
      console.error("[CLIENT LOG]", entry);
      if (Sentry) {
        try {
          Sentry.captureException(new Error(`[CLIENT LOG] ${message}`), { extra: { meta, timestamp } });
        } catch (e) {
          console.warn("Sentry captureException failed", e);
        }
      }
    } else if (level === "warn") {
      console.warn("[CLIENT LOG]", entry);
      if (Sentry) Sentry.captureMessage(`[CLIENT LOG][WARN] ${message}`, "warning");
    } else {
      console.log("[CLIENT LOG]", entry);
      if (Sentry) Sentry.captureMessage(`[CLIENT LOG][INFO] ${message}`);
    }

    return sendResponse(res, 200, "log received");
  } catch (err) {
    console.error("Failed to handle client log", err);
    return sendResponse(res, 500, "failed to handle client log");
  }
});

export default router;
