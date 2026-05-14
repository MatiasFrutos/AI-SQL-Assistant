"use strict";

import { aiConfigService } from "../services/ai-config.service.js";
import { renderLoader } from "../components/loader.js";

let currentConfig = null;

export function renderSettingsPage() {
  return `
    <div class="page-stack">
      <section class="section-header">
        <div>
          <p class="eyebrow">Proveedor y modelo IA</p>
          <h2>Configuración IA</h2>
          <p>Cambiá el proveedor activo, el modelo activo y el catálogo disponible.</p>
        </div>
      </section>

      <section id="aiConfigContainer">
        ${renderLoader("Cargando configuración IA...")}
      </section>
    </div>
  `;
}

export function bindSettingsPageEvents() {
  loadAIConfig();
}

async function loadAIConfig() {
  const container = document.querySelector("#aiConfigContainer");

  try {
    currentConfig = await aiConfigService.getConfig();
    container.innerHTML = renderConfigForms(currentConfig);
    bindConfigEvents();
  } catch (error) {
    container.innerHTML = `
      <div class="result-card">
        <h3>No se pudo cargar la configuración IA</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

function renderConfigForms(config) {
  const activeModels = config.models[config.activeProvider] || [];

  return `
    <div class="settings-grid">
      <article class="tool-card settings-card">
        <div class="tool-card__header">
          <div>
            <p class="eyebrow">Activo</p>
            <h2>Proveedor y modelo actual</h2>
            <p>Esto define qué proveedor/modelo usa el backend al responder.</p>
          </div>
        </div>

        <form class="smart-form" id="activeAIForm">
          <label>
            Proveedor activo
            <select name="activeProvider" id="activeProviderSelect">
              ${config.providers.map((provider) => {
                return `
                  <option
                    value="${provider.value}"
                    ${provider.value === config.activeProvider ? "selected" : ""}
                    ${provider.enabled ? "" : "disabled"}
                  >
                    ${provider.label}
                  </option>
                `;
              }).join("")}
            </select>
          </label>

          <label>
            Modelo activo
            <select name="activeModel" id="activeModelSelect">
              ${activeModels.map((model) => {
                return `
                  <option value="${model}" ${model === config.activeModel ? "selected" : ""}>
                    ${model}
                  </option>
                `;
              }).join("")}
            </select>
          </label>

          <button type="submit" class="btn btn-primary">
            Guardar activo
          </button>
        </form>
      </article>

      <article class="tool-card settings-card">
        <div class="tool-card__header">
          <div>
            <p class="eyebrow">Catálogo editable</p>
            <h2>Lista de proveedores y modelos</h2>
            <p>Editá el JSON del catálogo. Simple, directo y sin magia rara.</p>
          </div>
        </div>

        <form class="smart-form" id="catalogAIForm">
          <label>
            Catálogo IA JSON
            <textarea name="catalog" rows="18" spellcheck="false">${escapeHtml(JSON.stringify(config, null, 2))}</textarea>
          </label>

          <button type="submit" class="btn btn-secondary">
            Guardar catálogo
          </button>
        </form>
      </article>
    </div>
  `;
}

function bindConfigEvents() {
  const activeForm = document.querySelector("#activeAIForm");
  const catalogForm = document.querySelector("#catalogAIForm");
  const providerSelect = document.querySelector("#activeProviderSelect");
  const modelSelect = document.querySelector("#activeModelSelect");

  providerSelect.addEventListener("change", () => {
    const provider = providerSelect.value;
    const models = currentConfig.models[provider] || [];

    modelSelect.innerHTML = models.map((model) => {
      return `<option value="${model}">${model}</option>`;
    }).join("");
  });

  activeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(activeForm);

    try {
      currentConfig = await aiConfigService.updateActiveConfig({
        activeProvider: formData.get("activeProvider"),
        activeModel: formData.get("activeModel")
      });

      window.SQLMIND_TOAST?.("Proveedor y modelo actualizados.", "success");
      loadAIConfig();
    } catch (error) {
      window.SQLMIND_TOAST?.(error.message, "error");
    }
  });

  catalogForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(catalogForm);
    const raw = String(formData.get("catalog") || "").trim();

    try {
      const parsed = JSON.parse(raw);

      currentConfig = await aiConfigService.updateCatalog(parsed);

      window.SQLMIND_TOAST?.("Catálogo IA actualizado.", "success");
      loadAIConfig();
    } catch (error) {
      window.SQLMIND_TOAST?.(`JSON inválido o configuración incorrecta: ${error.message}`, "error");
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}