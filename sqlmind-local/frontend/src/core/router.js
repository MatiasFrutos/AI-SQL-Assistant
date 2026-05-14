"use strict";

export const router = {
  defaultRoute: "dashboard",
  onChange: null,

  init(options = {}) {
    this.defaultRoute = options.defaultRoute || "dashboard";
    this.onChange = options.onChange || null;

    window.addEventListener("hashchange", () => {
      this.resolve();
    });

    if (!window.location.hash) {
      this.go(this.defaultRoute);
      return;
    }

    this.resolve();
  },

  go(route) {
    window.location.hash = `#/${route}`;
  },

  getCurrentRoute() {
    const raw = window.location.hash.replace("#/", "").trim();
    return raw || this.defaultRoute;
  },

  resolve() {
    const route = this.getCurrentRoute();

    if (typeof this.onChange === "function") {
      this.onChange(route);
    }
  }
};