"use strict";

import { SQL_ENGINES } from "../core/config.js";
import { assistantService } from "../services/assistant.service.js";
import {
  renderResultCard,
  bindResultCardEvents
} from "../components/result-card.js";
import { renderLoader } from "../components/loader.js";

export function renderSchemaPage() {
  return `
    <div class="tool-layout">
      <section class="tool-card">
        <div class="tool-card__header">
          <div>
            <p class="eyebrow">Schema Builder</p>
            <h2>Generar CREATE TABLE</h2>
            <p>Describí la entidad y los campos. SQLMind arma una estructura inicial.</p>
          </div>
        </div>

        <form class="smart-form" id="schemaForm">
          <label>
            Motor SQL
            <select name="engine">
              ${SQL_ENGINES.map((engine) => {
                return `<option value="${engine.value}">${engine.label}</option>`;
              }).join("")}
            </select>
          </label>

          <label>
            Entidad o tabla
            <input
              name="entity"
              type="text"
              placeholder="Ejemplo: proveedores"
              required
            />
          </label>

          <label>
            Campos y reglas
            <textarea
              name="fields"
              rows="9"
              placeholder="Ejemplo: nombre requerido, cuit opcional, correo, teléfono, estado activo/inactivo, fecha de alta..."
              required
            ></textarea>
          </label>

          <button type="submit" class="btn btn-primary">
            Generar Schema
          </button>
        </form>
      </section>

      <section class="result-zone" id="schemaResult">
        <div class="placeholder-panel">
          <span>🧱</span>
          <h3>Schema pendiente</h3>
          <p>Convertí una idea de módulo en una tabla base sin pelearte con la sintaxis.</p>
        </div>
      </section>
    </div>
  `;
}

export function bindSchemaPageEvents() {
  const form = document.querySelector("#schemaForm");
  const resultZone = document.querySelector("#schemaResult");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const entity = String(formData.get("entity") || "").trim();
    const fields = String(formData.get("fields") || "").trim();

    if (!entity || !fields) {
      window.SQLMIND_TOAST?.("Completá entidad y campos para generar el schema.", "warning");
      return;
    }

    const payload = {
      engine: formData.get("engine"),
      input: `Crear tabla para entidad: ${entity}\nCampos y reglas:\n${fields}`
    };

    resultZone.innerHTML = renderLoader("Generando schema SQL...");

    const result = await assistantService.generateSchema(payload);

    resultZone.innerHTML = renderResultCard(result);
    bindResultCardEvents();

    window.SQLMIND_TOAST?.("Schema generado correctamente.", "success");
  });
}