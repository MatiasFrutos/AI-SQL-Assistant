"use strict";

const express = require("express");

const healthRoutes = require("./health.routes");
const assistantRoutes = require("./assistant.routes");
const historyRoutes = require("./history.routes");
const aiConfigRoutes = require("./ai-config.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/assistant", assistantRoutes);
router.use("/history", historyRoutes);
router.use("/ai-config", aiConfigRoutes);

router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    name: "SQLMind Local API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      aiConfig: "GET /api/ai-config",
      updateAiConfig: "PUT /api/ai-config",
      updateAiCatalog: "PUT /api/ai-config/catalog",
      generate: "POST /api/assistant/generate",
      explain: "POST /api/assistant/explain",
      optimize: "POST /api/assistant/optimize",
      schema: "POST /api/assistant/schema",
      history: "GET /api/history",
      clearHistory: "DELETE /api/history"
    }
  });
});

module.exports = router;