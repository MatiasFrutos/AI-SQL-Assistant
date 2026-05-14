"use strict";

import { router } from "./core/router.js";

import {
  renderToastContainer,
  showToast
} from "./components/toast.js";

import {
  renderNavbar,
  bindNavbarEvents
} from "./components/navbar.js";

import {
  renderSidebar,
  bindSidebarEvents
} from "./components/sidebar.js";

import {
  renderDashboardPage,
  bindDashboardPageEvents
} from "./pages/dashboard.page.js";

import {
  renderGeneratePage,
  bindGeneratePageEvents
} from "./pages/generate.page.js";

import {
  renderExplainPage,
  bindExplainPageEvents
} from "./pages/explain.page.js";

import {
  renderOptimizePage,
  bindOptimizePageEvents
} from "./pages/optimize.page.js";

import {
  renderSchemaPage,
  bindSchemaPageEvents
} from "./pages/schema.page.js";

import {
  renderHistoryPage,
  bindHistoryPageEvents
} from "./pages/history.page.js";

import {
  renderSettingsPage,
  bindSettingsPageEvents
} from "./pages/settings.page.js";

const appState = {
  route: "dashboard",
  sidebarCollapsed: false,
  theme: localStorage.getItem("sqlmind_theme") || "light"
};

const routes = {
  dashboard: {
    title: "Dashboard",
    render: renderDashboardPage,
    bind: bindDashboardPageEvents
  },
  generate: {
    title: "Generar SQL",
    render: renderGeneratePage,
    bind: bindGeneratePageEvents
  },
  explain: {
    title: "Explicar SQL",
    render: renderExplainPage,
    bind: bindExplainPageEvents
  },
  optimize: {
    title: "Optimizar SQL",
    render: renderOptimizePage,
    bind: bindOptimizePageEvents
  },
  schema: {
    title: "Schema Builder",
    render: renderSchemaPage,
    bind: bindSchemaPageEvents
  },
  history: {
    title: "Historial",
    render: renderHistoryPage,
    bind: bindHistoryPageEvents
  },
  settings: {
    title: "Configuración IA",
    render: renderSettingsPage,
    bind: bindSettingsPageEvents
  }
};

export function startApp() {
  window.SQLMIND_TOAST = showToast;
  window.SQLMIND_NAVIGATE = navigateTo;

  applyTheme();

  router.init({
    defaultRoute: "dashboard",
    onChange: (route) => {
      appState.route = routes[route] ? route : "dashboard";
      renderApp();
    }
  });
}

export function navigateTo(route) {
  router.go(route);
}

export function getCurrentRoute() {
  return appState.route;
}

export function getTheme() {
  return appState.theme;
}

export function toggleTheme() {
  appState.theme = appState.theme === "dark" ? "light" : "dark";
  localStorage.setItem("sqlmind_theme", appState.theme);
  applyTheme();
  renderApp();
}

export function toggleSidebar() {
  appState.sidebarCollapsed = !appState.sidebarCollapsed;
  renderApp();
}

function applyTheme() {
  document.documentElement.dataset.theme = appState.theme;
}

function renderApp() {
  const routeData = routes[appState.route] || routes.dashboard;

  document.title = `${routeData.title} | SQLMind Local`;

  const app = document.querySelector("#app");

  if (!app) {
    console.error("[SQLMind] No se encontró #app.");
    return;
  }

  app.innerHTML = `
    <div class="sqlmind-shell ${appState.sidebarCollapsed ? "is-sidebar-collapsed" : ""}">
      ${renderSidebar({
        active: appState.route,
        collapsed: appState.sidebarCollapsed
      })}

      <main class="sqlmind-main">
        ${renderNavbar({
          title: routeData.title,
          theme: appState.theme
        })}

        <section class="sqlmind-content">
          ${routeData.render()}
        </section>
      </main>

      ${renderToastContainer()}
    </div>
  `;

  bindNavbarEvents({
    onToggleTheme: toggleTheme,
    onToggleSidebar: toggleSidebar
  });

  bindSidebarEvents({
    onNavigate: navigateTo
  });

  routeData.bind();
}