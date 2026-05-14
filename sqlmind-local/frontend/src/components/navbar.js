"use strict";

export function renderNavbar(options = {}) {
  const title = options.title || "Dashboard";
  const theme = options.theme || "light";

  return `
    <header class="sqlmind-navbar">
      <div class="sqlmind-navbar__left">
        <button
          type="button"
          class="icon-btn"
          data-navbar-action="toggle-sidebar"
          aria-label="Contraer menú"
        >
          ☰
        </button>

        <div>
          <p class="eyebrow">AI SQL Assistant</p>
          <h1>${title}</h1>
        </div>
      </div>

      <div class="sqlmind-navbar__right">
        <div class="status-pill">
          <span class="status-dot"></span>
          Local Ready
        </div>

        <button
          type="button"
          class="theme-btn"
          data-navbar-action="toggle-theme"
        >
          ${theme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
        </button>
      </div>
    </header>
  `;
}

export function bindNavbarEvents(actions = {}) {
  document.querySelectorAll("[data-navbar-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.navbarAction;

      if (action === "toggle-theme" && typeof actions.onToggleTheme === "function") {
        actions.onToggleTheme();
      }

      if (action === "toggle-sidebar" && typeof actions.onToggleSidebar === "function") {
        actions.onToggleSidebar();
      }
    });
  });
}