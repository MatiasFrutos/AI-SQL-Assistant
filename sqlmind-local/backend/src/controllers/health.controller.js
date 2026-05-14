"use strict";

const { getIsoNow } = require("../utils/date.util");

function getHealth(req, res) {
  res.status(200).json({
    ok: true,
    name: "SQLMind Local API",
    status: "online",
    provider: process.env.AI_PROVIDER || "fake",
    timestamp: getIsoNow()
  });
}

module.exports = {
  getHealth
};