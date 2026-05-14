"use strict";

export function renderLoader(text = "Procesando solicitud...") {
  return `
    <div class="loader-box">
      <div class="loader-spinner"></div>
      <span>${text}</span>
    </div>
  `;
}