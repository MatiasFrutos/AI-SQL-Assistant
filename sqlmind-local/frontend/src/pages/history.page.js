"use strict";

import { historyService } from "../services/history.service.js";
import { renderEmptyState } from "../components/empty-state.js";

export function renderHistoryPage() {
  return `
    <div class="page-stack">
      <section class="section-header">
        <div>
          <p class="eyebrow">Registro local</p>
          <h2>Historial de consultas</h2>
          <p>Consultá los resultados generados durante tus sesiones.</p>
        </div>

        <button type="button" class="btn btn-danger" id="clearHistoryBtn">
          Limpiar historial
        </button>
      </section>

      <section id="historyList" class="history-list">
        <div class="loader-box">
          <div class="loader-spinner"></div>
          <span>Cargando historial...</span>
        </div>
      </section>
    </div>
  `;
}

export function bindHistoryPageEvents() {
  loadHistory();

  const clearButton = document.querySelector("#clearHistoryBtn");

  clearButton.addEventListener("click", async () => {
    const ok = confirm("¿Seguro que querés limpiar el historial local?");

    if (!ok) return;

    await historyService.clearHistory();

    window.SQLMIND_TOAST?.("Historial limpiado correctamente.", "success");

    loadHistory();
  });
}

async function loadHistory() {
  const container = document.querySelector("#historyList");

  if (!container) return;

  const items = await historyService.getHistory();

  if (!items.length) {
    container.innerHTML = renderEmptyState({
      icon: "🗂",
      title: "Sin historial",
      text: "Cuando generes, expliques u optimices SQL, los resultados aparecerán acá."
    });

    return;
  }

  container.innerHTML = items.map(renderHistoryItem).join("");

  bindHistoryCopyEvents();
}

function renderHistoryItem(item) {
  return `
    <article class="history-item">
      <div class="history-item__meta">
        <div>
          <span>${formatType(item.type)}</span>
          <strong>${item.engine || "SQL"}</strong>
        </div>

        <small>${formatDate(item.createdAt)}</small>
      </div>

      <p class="history-item__input">${escapeHtml(item.input || "")}</p>

      <pre class="history-code"><code>${escapeHtml(item.result || "")}</code></pre>

      <div class="history-item__actions">
        ${
          item.offline
            ? `<span class="soft-badge">Fallback local</span>`
            : `<span class="soft-badge">Backend</span>`
        }

        <button
          type="button"
          class="btn btn-secondary btn-small"
          data-copy-history="${item.id}"
        >
          Copiar resultado
        </button>
      </div>
    </article>
  `;
}

function bindHistoryCopyEvents() {
  document.querySelectorAll("[data-copy-history]").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".history-item");
      const code = card.querySelector("code")?.textContent || "";

      try {
        await navigator.clipboard.writeText(code);
        window.SQLMIND_TOAST?.("Resultado copiado.", "success");
      } catch {
        window.SQLMIND_TOAST?.("No se pudo copiar.", "error");
      }
    });
  });
}

function formatType(type) {
  const map = {
    generate: "Generar SQL",
    explain: "Explicar SQL",
    optimize: "Optimizar SQL",
    schema: "Schema Builder"
  };

  return map[type] || "Consulta";
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}