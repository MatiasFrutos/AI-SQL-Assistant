"use strict";

function notFoundMiddleware(req, res, next) {
  res.status(404).json({
    ok: false,
    message: "ROUTE_NOT_FOUND",
    path: req.originalUrl,
    method: req.method
  });
}

module.exports = notFoundMiddleware;