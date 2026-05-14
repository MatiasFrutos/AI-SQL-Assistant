"use strict";

const express = require("express");
const aiConfigController = require("../controllers/ai-config.controller");

const router = express.Router();

router.get("/", aiConfigController.getAIConfig);
router.put("/", aiConfigController.updateActiveAIConfig);
router.put("/catalog", aiConfigController.updateAICatalog);

module.exports = router;