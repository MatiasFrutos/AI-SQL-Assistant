"use strict";

const SIDEBAR_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "⌘"
  },
  {
    key: "generate",
    label: "Generar SQL",
    icon: "⚡"
  },
  {
    key: "explain",
    label: "Explicar",
    icon: "📘"
  },
  {
    key: "optimize",
    label: "Optimizar",
    icon: "🚀"
  },
  {
    key: "schema",
    label: "Schema",
    icon: "🧱"
  },
  {
    key: "history",
    label: "Historial",
    icon: "🗂"
  },
  {
    key: "settings",
    label: "IA Config",
    icon: "⚙"
  }
];

export function renderSidebar(options = {}) {
  const active = options.active || "dashboard";
  const collapsed = Boolean(options.collapsed);

  return `
    <aside class="sqlmind-sidebar ${collapsed ? "is-collapsed" : ""}">
      <div class="sqlmind-sidebar__brand">
        <div class="brand-mark">SQL</div>
        <div class="brand-copy">
          <strong>SQLMind</strong>
          <span>Local Assistant</span>
        </div>
      </div>

      <nav class="sqlmind-sidebar__nav">
        ${SIDEBAR_ITEMS.map((item) => {
          return `
            <button
              type="button"
              class="sidebar-link ${active === item.key ? "is-active" : ""}"
              data-route="${item.key}"
              title="${item.label}"
            >
              <span class="sidebar-link__icon">${item.icon}</span>
              <span class="sidebar-link__label">${item.label}</span>
            </button>
          `;
        }).join("")}
      </nav>

      <div class="sqlmind-sidebar__footer">
        <div class="mini-card">
          <strong>Modo local</strong>
          <span>Proveedor y modelo IA configurables.</span>
        </div>
      </div>
    </aside>
  `;
}

export function bindSidebarEvents(actions = {}) {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.route;

      if (typeof actions.onNavigate === "function") {
        actions.onNavigate(route);
      }
    });
  });
}