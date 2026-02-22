import { Request, Response, NextFunction } from "express";
import { SummaryService } from "../services/summary.service";
import { ApiResponse } from "../types/api";

export class SummaryController {
  private summaryService: SummaryService;

  constructor() {
    this.summaryService = new SummaryService();
  }

  getSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { country } = req.body;

      if (!country || country.trim() === "") {
        res.status(400).json({
          error: "Bad Request",
          message: 'Request body must include "country" field',
        });
        return;
      }

      const result = await this.summaryService.getSummary(country);
      res.status(200).json(result);
    } catch (error) {
      next(error as Error);
    }
  };

  invalidateCache = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = (req.query.q as string) || "";

      if (!query) {
        res.status(400).json({
          success: false,
          error: 'Query parameter "q" is required',
        });
        return;
      }

      const deleted = this.summaryService.invalidateCache(query);

      res.status(200).json({
        success: true,
        data: { deleted, query },
        timestamp: new Date().toISOString(),
      } as ApiResponse<{ deleted: boolean; query: string }>);
    } catch (error) {
      next(error as Error);
    }
  };

  cleanupCache = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deletedCount = this.summaryService.cleanupCache();

      res.status(200).json({
        success: true,
        data: { deletedCount },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error as Error);
    }
  };
}
