import express from "express";
import { config } from "./config";
import summaryRoutes from "./routes/summary.routes";
import countryRoutes from "./routes/country.routes";
import {
  errorHandler,
  requestLogger,
  notFoundHandler,
} from "./utils/middleware";
import { getDatabase, cleanupExpiredCache } from "./database/db";

const app = express();

// Middleware
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/summary", summaryRoutes);
app.use("/api/countries", countryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

function startServer(): void {
  try {
    getDatabase();
    console.log("✓ Database initialized");

    cleanupExpiredCache();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
