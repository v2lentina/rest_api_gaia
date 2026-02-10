import { Router } from "express";
import { SummaryController } from "../controllers/summary.controller";

const router = Router();
const summaryController = new SummaryController();

/**
 * GET /api/summary?q=...
 * Get a summary for a query (checks cache first)
 */
router.get("/", summaryController.getSummary);

/**
 * DELETE /api/summary/cache?q=...
 * Invalidate cache for a specific query
 */
router.delete("/cache", summaryController.invalidateCache);

/**
 * POST /api/summary/cache/cleanup
 * Clean up expired cache entries
 */
router.post("/cache/cleanup", summaryController.cleanupCache);

export default router;
