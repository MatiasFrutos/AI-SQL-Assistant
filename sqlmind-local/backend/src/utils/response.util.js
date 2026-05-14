"use strict";

function sendSuccess(res, data = {}, statusCode = 200) {
  res.status(statusCode).json({
    ok: true,
    ...normalizeData(data)
  });
}

function normalizeData(data) {
  if (Array.isArray(data)) {
    return {
      items: data
    };
  }

  if (data && typeof data === "object") {
    return data;
  }

  return {
    data
  };
}

module.exports = {
  sendSuccess
};