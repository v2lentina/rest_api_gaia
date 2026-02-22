import { Router } from "express";
import { SummaryController } from "../controllers/summary.controller";

const router = Router();
const summaryController = new SummaryController();

/**
 * POST /api/summary
 * Get a summary for a country (checks cache first)
 * Body: { country: string }
 */
router.post("/", summaryController.getSummary);

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
