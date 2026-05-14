"use strict";

export function renderResultCard(result) {
  if (!result) {
    return "";
  }

  return `
    <article class="result-card">
      <div class="result-card__header">
        <div>
          <p class="eyebrow">${formatType(result.type)} · ${result.engine}</p>
          <h3>Resultado generado</h3>
        </div>

        <button
          type="button"
          class="btn btn-secondary"
          data-copy-result
        >
          Copiar
        </button>
      </div>

      ${
        result.offline
          ? `<div class="soft-warning">Modo fallback: el backend no respondió, pero la UI sigue operativa.</div>`
          : ""
      }

      <pre class="code-block"><code>${escapeHtml(result.result || "")}</code></pre>

      ${
        result.explanation
          ? `
            <div class="result-card__section">
              <h4>Explicación</h4>
              <p>${escapeHtml(result.explanation)}</p>
            </div>
          `
          : ""
      }

      ${
        Array.isArray(result.notes) && result.notes.length
          ? `
            <div class="result-card__section">
              <h4>Notas técnicas</h4>
              <ul>
                ${result.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
              </ul>
            </div>
          `
          : ""
      }
    </article>
  `;
}

export function bindResultCardEvents() {
  const button = document.querySelector("[data-copy-result]");

  if (!button) return;

  button.addEventListener("click", async () => {
    const code = document.querySelector(".code-block code")?.textContent || "";

    try {
      await navigator.clipboard.writeText(code);
      window.SQLMIND_TOAST?.("Resultado copiado al portapapeles.", "success");
    } catch {
      window.SQLMIND_TOAST?.("No se pudo copiar el resultado.", "error");
    }
  });
}

function formatType(type) {
  const map = {
    generate: "Generar SQL",
    explain: "Explicar SQL",
    optimize: "Optimizar SQL",
    schema: "Schema Builder"
  };

  return map[type] || "Resultado";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}