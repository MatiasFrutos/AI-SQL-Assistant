"use strict";

const fs = require("fs/promises");
const path = require("path");

async function ensureFile(filePath, fallbackValue) {
  const dir = path.dirname(filePath);

  await fs.mkdir(dir, {
    recursive: true
  });

  try {
    await fs.access(filePath);
  } catch {
    await writeJson(filePath, fallbackValue);
  }
}

async function readJson(filePath, fallbackValue = null) {
  try {
    await ensureFile(filePath, fallbackValue);

    const raw = await fs.readFile(filePath, "utf8");

    if (!raw.trim()) {
      return fallbackValue;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error("[storage.readJson]", error.message);
    return fallbackValue;
  }
}

async function writeJson(filePath, data) {
  const dir = path.dirname(filePath);

  await fs.mkdir(dir, {
    recursive: true
  });

  const content = JSON.stringify(data, null, 2);

  await fs.writeFile(filePath, content, "utf8");

  return true;
}

module.exports = {
  readJson,
  writeJson,
  ensureFile
};