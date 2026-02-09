import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types";

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[Error]", err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unknown error
  res.status(500).json({
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Request logger middleware
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${
        res.statusCode
      } (${duration}ms)`
    );
  });

  next();
}

/**
 * 404 handler
 */
export function notFoundHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    success: false,
    error: "Route not found",
    timestamp: new Date().toISOString(),
  });
}
