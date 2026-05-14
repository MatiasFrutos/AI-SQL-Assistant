"use strict";

const assistantService = require("../services/assistant.service");
const { sendSuccess } = require("../utils/response.util");

async function generateSQL(req, res, next) {
  try {
    const result = await assistantService.generateSQL(req.body);

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

async function explainSQL(req, res, next) {
  try {
    const result = await assistantService.explainSQL(req.body);

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

async function optimizeSQL(req, res, next) {
  try {
    const result = await assistantService.optimizeSQL(req.body);

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

async function generateSchema(req, res, next) {
  try {
    const result = await assistantService.generateSchema(req.body);

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateSQL,
  explainSQL,
  optimizeSQL,
  generateSchema
};