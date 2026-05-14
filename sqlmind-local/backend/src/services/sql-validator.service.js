"use strict";

function validateNaturalLanguageRequest(input) {
  const text = String(input || "").trim();

  if (!text) {
    return {
      ok: false,
      message: "INPUT_REQUIRED"
    };
  }

  if (text.length < 8) {
    return {
      ok: false,
      message: "INPUT_TOO_SHORT"
    };
  }

  if (text.length > 8000) {
    return {
      ok: false,
      message: "INPUT_TOO_LONG"
    };
  }

  return {
    ok: true
  };
}

function validateSQLInput(input) {
  const text = String(input || "").trim();

  if (!text) {
    return {
      ok: false,
      message: "SQL_INPUT_REQUIRED"
    };
  }

  if (text.length < 6) {
    return {
      ok: false,
      message: "SQL_INPUT_TOO_SHORT"
    };
  }

  if (text.length > 12000) {
    return {
      ok: false,
      message: "SQL_INPUT_TOO_LONG"
    };
  }

  return {
    ok: true
  };
}

function hasDangerousStatement(sql) {
  const text = String(sql || "").toLowerCase();

  const dangerous = [
    "drop database",
    "drop schema",
    "truncate table",
    "delete from",
    "update ",
    "alter table"
  ];

  return dangerous.some((item) => text.includes(item));
}

module.exports = {
  validateNaturalLanguageRequest,
  validateSQLInput,
  hasDangerousStatement
};