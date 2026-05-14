"use strict";

import { APP_CONFIG } from "./config.js";

export async function apiClient(path, options = {}) {
  const url = `${APP_CONFIG.apiBaseUrl}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), APP_CONFIG.timeoutMs);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error ||
        `Error HTTP ${response.status}`;

      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("La solicitud tardó demasiado. Verificá el backend.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}