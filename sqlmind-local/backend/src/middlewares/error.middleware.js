"use strict";

function errorMiddleware(error, req, res, next) {
  const statusCode = Number(error.statusCode || error.status || 500);

  if (statusCode >= 500) {
    console.error("[SQLMind API Error]", {
      message: error.message,
      stack: error.stack
    });
  }

  res.status(statusCode).json({
    ok: false,
    message: error.message || "INTERNAL_SERVER_ERROR",
    statusCode
  });
}

module.exports = errorMiddleware;