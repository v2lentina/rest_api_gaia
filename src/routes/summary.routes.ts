import { Router } from "express";
import { SummaryController } from "../controllers/summary.controller";

const router = Router();
const summaryController = new SummaryController();

/**
 * GET /api/summary?q=...
 * Get a summary for a query (checks cache first)
 */
router.get("/summary", summaryController.getSummary);

/**
 * DELETE /api/summary/cache?q=...
 * Invalidate cache for a specific query
 */
router.delete("/summary/cache", summaryController.invalidateCache);

/**
 * POST /api/summary/cache/cleanup
 * Clean up expired cache entries
 */
router.post("/summary/cache/cleanup", summaryController.cleanupCache);

export default router;
