"use strict";

import { SQL_ENGINES } from "../core/config.js";
import { assistantService } from "../services/assistant.service.js";
import {
  renderResultCard,
  bindResultCardEvents
} from "../components/result-card.js";
import { renderLoader } from "../components/loader.js";

export function renderGeneratePage() {
  return `
    <div class="tool-layout">
      <section class="tool-card">
        <div class="tool-card__header">
          <div>
            <p class="eyebrow">Natural Language → SQL</p>
            <h2>Generar consulta SQL</h2>
            <p>Escribí qué necesitás consultar y elegí el motor de base de datos.</p>
          </div>
        </div>

        <form class="smart-form" id="generateForm">
          <label>
            Motor SQL
            <select name="engine">
              ${SQL_ENGINES.map((engine) => {
                return `<option value="${engine.value}">${engine.label}</option>`;
              }).join("")}
            </select>
          </label>

          <label>
            Necesidad
            <textarea
              name="input"
              rows="8"
              placeholder="Ejemplo: Necesito listar los proveedores activos ordenados por fecha de alta..."
              required
            ></textarea>
          </label>

          <div class="prompt-examples">
            <button type="button" data-example="Listar clientes con total de pedidos y último pedido realizado.">
              Clientes + pedidos
            </button>
            <button type="button" data-example="Buscar facturas vencidas con cliente, importe, fecha de vencimiento y estado.">
              Facturas vencidas
            </button>
            <button type="button" data-example="Obtener técnicos con cantidad de órdenes de trabajo cerradas este mes.">
              Técnicos + OT
            </button>
          </div>

          <button type="submit" class="btn btn-primary">
            Generar SQL
          </button>
        </form>
      </section>

      <section class="result-zone" id="generateResult">
        <div class="placeholder-panel">
          <span>⚡</span>
          <h3>Tu consulta aparecerá acá</h3>
          <p>El resultado se puede copiar y queda guardado en historial.</p>
        </div>
      </section>
    </div>
  `;
}

export function bindGeneratePageEvents() {
  const form = document.querySelector("#generateForm");
  const resultZone = document.querySelector("#generateResult");

  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      const textarea = form.querySelector("[name='input']");
      textarea.value = button.dataset.example;
      textarea.focus();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const payload = {
      engine: formData.get("engine"),
      input: String(formData.get("input") || "").trim()
    };

    if (!payload.input) {
      window.SQLMIND_TOAST?.("Escribí una necesidad para generar SQL.", "warning");
      return;
    }

    resultZone.innerHTML = renderLoader("Generando consulta SQL...");

    const result = await assistantService.generateSQL(payload);

    resultZone.innerHTML = renderResultCard(result);
    bindResultCardEvents();

    window.SQLMIND_TOAST?.("Consulta generada correctamente.", "success");
  });
}