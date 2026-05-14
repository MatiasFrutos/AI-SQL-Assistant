"use strict";

const express = require("express");

const historyController = require("../controllers/history.controller");

const router = express.Router();

router.get("/", historyController.getHistory);
router.get("/:id", historyController.getHistoryItem);
router.delete("/", historyController.clearHistory);
router.delete("/:id", historyController.deleteHistoryItem);

module.exports = router;