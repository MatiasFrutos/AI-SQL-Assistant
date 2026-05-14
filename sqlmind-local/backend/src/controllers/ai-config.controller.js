"use strict";

const aiConfigService = require("../services/ai-config.service");
const { sendSuccess } = require("../utils/response.util");

async function getAIConfig(req, res, next) {
  try {
    const config = await aiConfigService.getConfig();

    sendSuccess(res, {
      config
    });
  } catch (error) {
    next(error);
  }
}

async function updateActiveAIConfig(req, res, next) {
  try {
    const config = await aiConfigService.updateActiveConfig(req.body);

    sendSuccess(res, {
      message: "AI_CONFIG_UPDATED",
      config
    });
  } catch (error) {
    next(error);
  }
}

async function updateAICatalog(req, res, next) {
  try {
    const config = await aiConfigService.updateCatalog(req.body);

    sendSuccess(res, {
      message: "AI_CATALOG_UPDATED",
      config
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAIConfig,
  updateActiveAIConfig,
  updateAICatalog
};