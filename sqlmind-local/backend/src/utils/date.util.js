"use strict";

function getIsoNow() {
  return new Date().toISOString();
}

function formatDateAR(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

module.exports = {
  getIsoNow,
  formatDateAR
};