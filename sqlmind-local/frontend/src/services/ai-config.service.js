"use strict";

import { apiClient } from "../core/api.client.js";

export const aiConfigService = {
  async getConfig() {
    const response = await apiClient("/ai-config");

    return response.config;
  },

  async updateActiveConfig(payload) {
    const response = await apiClient("/ai-config", {
      method: "PUT",
      body: payload
    });

    return response.config;
  },

  async updateCatalog(payload) {
    const response = await apiClient("/ai-config/catalog", {
      method: "PUT",
      body: payload
    });

    return response.config;
  }
};