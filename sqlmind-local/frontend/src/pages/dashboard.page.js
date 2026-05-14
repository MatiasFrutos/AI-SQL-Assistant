"use strict";

import { historyService } from "../services/history.service.js";

export function renderDashboardPage() {
  return `
    <div class="page-stack">
      <section class="hero-card">
        <div>
          <p class="eyebrow">Local AI Workbench para SQL</p>
          <h2>Generá, explicá y optimizá consultas SQL desde una sola interfaz.</h2>
          <p>
            SQLMind Local está pensado para developers, analistas y equipos técnicos que necesitan trabajar más rápido con bases de datos.
          </p>

          <div class="hero-actions">
            <button class="btn btn-primary" data-go="generate">Generar SQL</button>
            <button class="btn btn-secondary" data-go="schema">Crear Schema</button>
          </div>
        </div>

        <div class="hero-panel">
          <span>SELECT</span>
          <strong>*</strong>
          <small>FROM ideas WHERE valor = 'alto';</small>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card">
          <span>Motor principal</span>
          <strong>PostgreSQL</strong>
          <p>También preparado para MySQL, SQLite y SQL Server.</p>
        </article>

        <article class="stat-card">
          <span>Modo</span>
          <strong>Local First</strong>
          <p>La interfaz responde incluso si el backend todavía no está activo.</p>
        </article>

        <article class="stat-card">
          <span>Historial</span>
          <strong id="historyCount">...</strong>
          <p>Prompts y resultados guardados localmente.</p>
        </article>
      </section>

      <section class="feature-grid">
        <article class="feature-card" data-go="generate">
          <div class="feature-card__icon">⚡</div>
          <h3>Generar SQL</h3>
          <p>Convertí una necesidad escrita en lenguaje natural en una consulta SQL limpia.</p>
        </article>

        <article class="feature-card" data-go="explain">
          <div class="feature-card__icon">📘</div>
          <h3>Explicar SQL</h3>
          <p>Pegá una query y obtené una explicación clara sobre qué hace y qué revisar.</p>
        </article>

        <article class="feature-card" data-go="optimize">
          <div class="feature-card__icon">🚀</div>
          <h3>Optimizar</h3>
          <p>Detectá posibles mejoras, índices sugeridos y ajustes de performance.</p>
        </article>

        <article class="feature-card" data-go="schema">
          <div class="feature-card__icon">🧱</div>
          <h3>Schema Builder</h3>
          <p>Generá estructuras CREATE TABLE listas para adaptar a proyectos reales.</p>
        </article>
      </section>
    </div>
  `;
}

export function bindDashboardPageEvents() {
  document.querySelectorAll("[data-go]").forEach((element) => {
    element.addEventListener("click", () => {
      window.SQLMIND_NAVIGATE?.(element.dataset.go);
    });
  });

  loadHistoryCount();
}

async function loadHistoryCount() {
  const target = document.querySelector("#historyCount");

  if (!target) return;

  const history = await historyService.getHistory();
  target.textContent = String(history.length);
}