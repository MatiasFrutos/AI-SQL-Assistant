"use strict";

const express = require("express");

const assistantController = require("../controllers/assistant.controller");

const router = express.Router();

router.post("/generate", assistantController.generateSQL);
router.post("/explain", assistantController.explainSQL);
router.post("/optimize", assistantController.optimizeSQL);
router.post("/schema", assistantController.generateSchema);

module.exports = router;