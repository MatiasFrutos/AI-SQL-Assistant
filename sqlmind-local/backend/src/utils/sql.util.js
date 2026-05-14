"use strict";

const ALLOWED_ENGINES = [
  "postgresql",
  "mysql",
  "sqlite",
  "sqlserver"
];

function normalizeSqlEngine(engine) {
  const value = String(engine || "postgresql")
    .trim()
    .toLowerCase();

  if (value === "postgres" || value === "pgsql") {
    return "postgresql";
  }

  if (value === "mssql" || value === "sql-server" || value === "sql server") {
    return "sqlserver";
  }

  if (!ALLOWED_ENGINES.includes(value)) {
    return "postgresql";
  }

  return value;
}

function detectMainTableName(input) {
  const text = String(input || "")
    .trim()
    .toLowerCase();

  const known = [
    "proveedores",
    "clientes",
    "facturas",
    "pedidos",
    "ordenes_trabajo",
    "ordenes",
    "tecnicos",
    "usuarios",
    "productos",
    "stock",
    "remitos",
    "pagos",
    "empleados",
    "tickets"
  ];

  for (const table of known) {
    if (text.includes(table)) {
      return normalizeTableName(table);
    }
  }

  const matchEntidad = text.match(/entidad:\s*([a-zA-Z0-9_áéíóúñ\s-]+)/i);

  if (matchEntidad && matchEntidad[1]) {
    return normalizeTableName(matchEntidad[1]);
  }

  const matchTabla = text.match(/tabla\s+([a-zA-Z0-9_áéíóúñ\s-]+)/i);

  if (matchTabla && matchTabla[1]) {
    return normalizeTableName(matchTabla[1]);
  }

  return null;
}

function normalizeTableName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_ -]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

module.exports = {
  normalizeSqlEngine,
  detectMainTableName,
  normalizeTableName
};