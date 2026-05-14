"use strict";

const sqlGeneratorService = require("./sql-generator.service");
const sqlExplainerService = require("./sql-explainer.service");
const sqlOptimizerService = require("./sql-optimizer.service");
const sqlValidatorService = require("./sql-validator.service");
const historyService = require("./history.service");

const { createId } = require("../utils/id.util");
const { getIsoNow } = require("../utils/date.util");
const { normalizeSqlEngine } = require("../utils/sql.util");

async function generateSQL(payload = {}) {
  const normalizedPayload = normalizeAssistantPayload(payload, "generate");

  const validation = sqlValidatorService.validateNaturalLanguageRequest(
    normalizedPayload.input
  );

  if (!validation.ok) {
    throw createBadRequest(validation.message);
  }

  const result = await sqlGeneratorService.generate(normalizedPayload);

  return saveAndReturn({
    type: "generate",
    payload: normalizedPayload,
    result
  });
}

async function explainSQL(payload = {}) {
  const normalizedPayload = normalizeAssistantPayload(payload, "explain");

  const validation = sqlValidatorService.validateSQLInput(
    normalizedPayload.input
  );

  if (!validation.ok) {
    throw createBadRequest(validation.message);
  }

  const result = await sqlExplainerService.explain(normalizedPayload);

  return saveAndReturn({
    type: "explain",
    payload: normalizedPayload,
    result
  });
}

async function optimizeSQL(payload = {}) {
  const normalizedPayload = normalizeAssistantPayload(payload, "optimize");

  const validation = sqlValidatorService.validateSQLInput(
    normalizedPayload.input
  );

  if (!validation.ok) {
    throw createBadRequest(validation.message);
  }

  const result = await sqlOptimizerService.optimize(normalizedPayload);

  return saveAndReturn({
    type: "optimize",
    payload: normalizedPayload,
    result
  });
}

async function generateSchema(payload = {}) {
  const normalizedPayload = normalizeAssistantPayload(payload, "schema");

  const validation = sqlValidatorService.validateNaturalLanguageRequest(
    normalizedPayload.input
  );

  if (!validation.ok) {
    throw createBadRequest(validation.message);
  }

  const result = await sqlGeneratorService.generateSchema(normalizedPayload);

  return saveAndReturn({
    type: "schema",
    payload: normalizedPayload,
    result
  });
}

function normalizeAssistantPayload(payload, type) {
  return {
    type,
    engine: normalizeSqlEngine(payload.engine),
    input: String(payload.input || "").trim(),
    options: payload.options && typeof payload.options === "object"
      ? payload.options
      : {}
  };
}

async function saveAndReturn({ type, payload, result }) {
  const item = {
    id: createId(),
    type,
    engine: payload.engine,
    input: payload.input,
    result: result.result,
    explanation: result.explanation || "",
    notes: Array.isArray(result.notes) ? result.notes : [],
    provider: result.provider || "fake",
    createdAt: getIsoNow(),
    offline: false
  };

  await historyService.add(item);

  return item;
}

function createBadRequest(message) {
  const error = new Error(message || "BAD_REQUEST");
  error.statusCode = 400;
  return error;
}

module.exports = {
  generateSQL,
  explainSQL,
  optimizeSQL,
  generateSchema
};