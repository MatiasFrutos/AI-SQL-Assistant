"use strict";

const crypto = require("crypto");

function createId(prefix = "sqlmind") {
  const value = crypto.randomUUID();

  return `${prefix}_${value}`;
}

module.exports = {
  createId
};