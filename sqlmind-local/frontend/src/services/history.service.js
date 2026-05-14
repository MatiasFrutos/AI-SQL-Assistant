"use strict";

import { apiClient } from "../core/api.client.js";
import { APP_CONFIG } from "../core/config.js";

export const historyService = {
  async getHistory() {
    try {
      const response = await apiClient("/history");
      return Array.isArray(response) ? response : response.items || [];
    } catch {
      return getLocalHistory();
    }
  },

  async clearHistory() {
    try {
      await apiClient("/history", {
        method: "DELETE"
      });
    } catch {
      clearLocalHistory();
    }

    clearLocalHistory();

    return {
      ok: true
    };
  }
};

export function getLocalHistory() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKeys.localHistory);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalHistoryItem(item) {
  const current = getLocalHistory();

  const next = [
    {
      ...item,
      id: item.id || crypto.randomUUID(),
      createdAt: item.createdAt || new Date().toISOString()
    },
    ...current
  ].slice(0, 100);

  localStorage.setItem(
    APP_CONFIG.storageKeys.localHistory,
    JSON.stringify(next)
  );
}

export function clearLocalHistory() {
  localStorage.removeItem(APP_CONFIG.storageKeys.localHistory);
}