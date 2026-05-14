"use strict";

import { SQL_ENGINES } from "../core/config.js";
import { assistantService } from "../services/assistant.service.js";
import {
  renderResultCard,
  bindResultCardEvents
} from "../components/result-card.js";
import { renderLoader } from "../components/loader.js";

export function renderOptimizePage() {
  return `
    <div class="tool-layout">
      <section class="tool-card">
        <div class="tool-card__header">
          <div>
            <p class="eyebrow">Performance Review</p>
            <h2>Optimizar consulta SQL</h2>
            <p>Detectá mejoras posibles, filtros débiles, SELECT innecesarios e índices sugeridos.</p>
          </div>
        </div>

        <form class="smart-form" id="optimizeForm">
          <label>
            Motor SQL
            <select name="engine">
              ${SQL_ENGINES.map((engine) => {
                return `<option value="${engine.value}">${engine.label}</option>`;
              }).join("")}
            </select>
          </label>

          <label>
            Consulta SQL
            <textarea
              name="input"
              rows="10"
              placeholder="Pegá una consulta que quieras optimizar..."
              required
            ></textarea>
          </label>

          <label>
            Contexto opcional
            <input
              name="context"
              type="text"
              placeholder="Ejemplo: tabla con 500k registros, filtro por estado y fecha..."
            />
          </label>

          <button type="submit" class="btn btn-primary">
            Optimizar SQL
          </button>
        </form>
      </section>

      <section class="result-zone" id="optimizeResult">
        <div class="placeholder-panel">
          <span>🚀</span>
          <h3>Optimización pendiente</h3>
          <p>Un pequeño índice a tiempo evita una reunión incómoda después.</p>
        </div>
      </section>
    </div>
  `;
}

export function bindOptimizePageEvents() {
  const form = document.querySelector("#optimizeForm");
  const resultZone = document.querySelector("#optimizeResult");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const input = String(formData.get("input") || "").trim();
    const context = String(formData.get("context") || "").trim();

    const payload = {
      engine: formData.get("engine"),
      input: context ? `${input}\n\nContexto:\n${context}` : input
    };

    if (!input) {
      window.SQLMIND_TOAST?.("Pegá una consulta para optimizar.", "warning");
      return;
    }

    resultZone.innerHTML = renderLoader("Buscando mejoras de performance...");

    const result = await assistantService.optimizeSQL(payload);

    resultZone.innerHTML = renderResultCard(result);
    bindResultCardEvents();

    window.SQLMIND_TOAST?.("Optimización generada correctamente.", "success");
  });
}