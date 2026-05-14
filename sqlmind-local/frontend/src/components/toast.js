"use strict";

export function renderToastContainer() {
  return `
    <div class="toast-container" id="toastContainer"></div>
  `;
}

export function showToast(message, type = "info") {
  const container = document.querySelector("#toastContainer");

  if (!container) {
    console.log(`[toast:${type}]`, message);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <strong>${getToastTitle(type)}</strong>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("is-leaving");
  }, 3200);

  setTimeout(() => {
    toast.remove();
  }, 3800);
}

function getToastTitle(type) {
  const titles = {
    success: "Listo",
    error: "Error",
    warning: "Atención",
    info: "Info"
  };

  return titles[type] || "Info";
}