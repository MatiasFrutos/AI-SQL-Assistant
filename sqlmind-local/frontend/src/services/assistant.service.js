"use strict";

import { apiClient } from "../core/api.client.js";
import { saveLocalHistoryItem } from "./history.service.js";

export const assistantService = {
  async generateSQL(payload) {
    return runWithFallback("/assistant/generate", "generate", payload);
  },

  async explainSQL(payload) {
    return runWithFallback("/assistant/explain", "explain", payload);
  },

  async optimizeSQL(payload) {
    return runWithFallback("/assistant/optimize", "optimize", payload);
  },

  async generateSchema(payload) {
    return runWithFallback("/assistant/schema", "schema", payload);
  }
};

async function runWithFallback(path, type, payload) {
  try {
    const response = await apiClient(path, {
      method: "POST",
      body: payload
    });

    const normalized = normalizeResponse(type, payload, response, false);
    saveLocalHistoryItem(normalized);

    return normalized;
  } catch (error) {
    const fallback = createFallbackResponse(type, payload, error);
    saveLocalHistoryItem(fallback);

    return fallback;
  }
}

function normalizeResponse(type, payload, response, offline) {
  return {
    id: response.id || crypto.randomUUID(),
    type,
    engine: payload.engine,
    input: payload.input,
    result: response.result || response.sql || response.content || "",
    explanation: response.explanation || "",
    notes: response.notes || [],
    createdAt: response.createdAt || new Date().toISOString(),
    offline
  };
}

function createFallbackResponse(type, payload, error) {
  const result = getLocalMockResult(type, payload);

  return {
    id: crypto.randomUUID(),
    type,
    engine: payload.engine || "postgresql",
    input: payload.input || "",
    result,
    explanation:
      "Resultado generado en modo local de respaldo porque el backend todavía no respondió.",
    notes: [
      "Este modo permite probar la interfaz sin backend.",
      `Detalle técnico: ${error.message}`
    ],
    createdAt: new Date().toISOString(),
    offline: true
  };
}

function getLocalMockResult(type, payload) {
  const engine = payload.engine || "postgresql";
  const input = (payload.input || "").toLowerCase();

  if (type === "generate") {
    if (input.includes("proveedor")) {
      return `SELECT
  id,
  nombre,
  cuit,
  correo,
  estado,
  created_at
FROM proveedores
WHERE estado = 'activo'
ORDER BY created_at DESC;`;
    }

    if (input.includes("cliente")) {
      return `SELECT
  c.id,
  c.nombre,
  c.cuit,
  COUNT(p.id) AS total_pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nombre, c.cuit
ORDER BY total_pedidos DESC;`;
    }

    return `SELECT
  id,
  nombre,
  estado,
  created_at
FROM tabla_principal
WHERE estado = 'activo'
ORDER BY created_at DESC;`;
  }

  if (type === "explain") {
    return `La consulta selecciona registros desde una tabla, aplica filtros si existen, ordena el resultado y puede agrupar información según las columnas indicadas.

Puntos a revisar:
- Confirmar que las columnas existan.
- Validar índices sobre campos usados en WHERE.
- Evitar SELECT * en producción.
- Revisar joins si hay duplicados inesperados.`;
  }

  if (type === "optimize") {
    return `-- Versión sugerida
SELECT
  id,
  nombre,
  estado,
  created_at
FROM tabla_principal
WHERE estado = 'activo'
ORDER BY created_at DESC
LIMIT 100;

-- Recomendación de índice
CREATE INDEX idx_tabla_principal_estado_created_at
ON tabla_principal (estado, created_at DESC);`;
  }

  if (type === "schema") {
    if (engine === "mysql") {
      return `CREATE TABLE proveedores (
  id CHAR(36) PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  cuit VARCHAR(32),
  correo VARCHAR(160),
  telefono VARCHAR(80),
  estado VARCHAR(32) NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
    }

    if (engine === "sqlite") {
      return `CREATE TABLE proveedores (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  cuit TEXT,
  correo TEXT,
  telefono TEXT,
  estado TEXT NOT NULL DEFAULT 'activo',
  created_at TEXT NOT NULL
);`;
    }

    return `CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cuit TEXT,
  correo TEXT,
  telefono TEXT,
  estado TEXT NOT NULL DEFAULT 'activo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;
  }

  return "-- Sin resultado disponible.";
}