"use strict";

const path = require("path");

const storageService = require("./storage.service");

const HISTORY_PATH = path.join(__dirname, "../data/history.json");

async function getAll() {
  const items = await storageService.readJson(HISTORY_PATH, []);

  if (!Array.isArray(items)) {
    return [];
  }

  return items.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

async function getById(id) {
  const items = await getAll();

  return items.find((item) => item.id === id) || null;
}

async function add(item) {
  const items = await getAll();

  const maxItems = Number(process.env.HISTORY_MAX_ITEMS || 200);

  const nextItems = [
    item,
    ...items.filter((current) => current.id !== item.id)
  ].slice(0, maxItems);

  await storageService.writeJson(HISTORY_PATH, nextItems);

  return item;
}

async function clear() {
  await storageService.writeJson(HISTORY_PATH, []);

  return true;
}

async function removeById(id) {
  const items = await getAll();

  const exists = items.some((item) => item.id === id);

  if (!exists) {
    return false;
  }

  const nextItems = items.filter((item) => item.id !== id);

  await storageService.writeJson(HISTORY_PATH, nextItems);

  return true;
}

module.exports = {
  getAll,
  getById,
  add,
  clear,
  removeById
};