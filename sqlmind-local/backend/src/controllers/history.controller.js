"use strict";

const historyService = require("../services/history.service");
const { sendSuccess } = require("../utils/response.util");

async function getHistory(req, res, next) {
  try {
    const history = await historyService.getAll();

    sendSuccess(res, {
      items: history,
      total: history.length
    });
  } catch (error) {
    next(error);
  }
}

async function getHistoryItem(req, res, next) {
  try {
    const item = await historyService.getById(req.params.id);

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: "HISTORY_ITEM_NOT_FOUND"
      });
    }

    sendSuccess(res, item);
  } catch (error) {
    next(error);
  }
}

async function clearHistory(req, res, next) {
  try {
    await historyService.clear();

    sendSuccess(res, {
      message: "HISTORY_CLEARED"
    });
  } catch (error) {
    next(error);
  }
}

async function deleteHistoryItem(req, res, next) {
  try {
    const deleted = await historyService.removeById(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: "HISTORY_ITEM_NOT_FOUND"
      });
    }

    sendSuccess(res, {
      message: "HISTORY_ITEM_DELETED"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHistory,
  getHistoryItem,
  clearHistory,
  deleteHistoryItem
};