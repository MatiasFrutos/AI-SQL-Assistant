"use strict";

export function renderEmptyState(options = {}) {
  const title = options.title || "Sin información";
  const text = options.text || "Todavía no hay datos para mostrar.";
  const icon = options.icon || "☁️";

  return `
    <div class="empty-state">
      <div class="empty-state__icon">${icon}</div>
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}