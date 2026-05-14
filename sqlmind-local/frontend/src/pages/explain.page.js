"use strict";

import { SQL_ENGINES } from "../core/config.js";
import { assistantService } from "../services/assistant.service.js";
import {
  renderResultCard,
  bindResultCardEvents
} from "../components/result-card.js";
import { renderLoader } from "../components/loader.js";

export function renderExplainPage() {
  return `
    <div class="tool-layout">
      <section class="tool-card">
        <div class="tool-card__header">
          <div>
            <p class="eyebrow">SQL → explicación clara</p>
            <h2>Explicar consulta SQL</h2>
            <p>Pegá una query y obtené una lectura funcional y técnica.</p>
          </div>
        </div>

        <form class="smart-form" id="explainForm">
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
              placeholder="Pegá tu consulta SQL..."
              required
            ></textarea>
          </label>

          <button type="submit" class="btn btn-primary">
            Explicar SQL
          </button>
        </form>
      </section>

      <section class="result-zone" id="explainResult">
        <div class="placeholder-panel">
          <span>📘</span>
          <h3>Explicación pendiente</h3>
          <p>Ideal para entender queries heredadas sin invocar espíritus del legacy.</p>
        </div>
      </section>
    </div>
  `;
}

export function bindExplainPageEvents() {
  const form = document.querySelector("#explainForm");
  const resultZone = document.querySelector("#explainResult");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const payload = {
      engine: formData.get("engine"),
      input: String(formData.get("input") || "").trim()
    };

    if (!payload.input) {
      window.SQLMIND_TOAST?.("Pegá una consulta para explicar.", "warning");
      return;
    }

    resultZone.innerHTML = renderLoader("Analizando consulta SQL...");

    const result = await assistantService.explainSQL(payload);

    resultZone.innerHTML = renderResultCard(result);
    bindResultCardEvents();

    window.SQLMIND_TOAST?.("Consulta explicada correctamente.", "success");
  });
}