"use strict";

const {
  detectMainTableName,
  normalizeSqlEngine
} = require("../utils/sql.util");

async function generate(options = {}) {
  const mode = options.mode || "generate";
  const engine = normalizeSqlEngine(options.engine);
  const input = String(options.input || "").trim();
  const providerError = options.providerError || null;

  const handlers = {
    generate: generateSQL,
    explain: explainSQL,
    optimize: optimizeSQL,
    schema: generateSchema
  };

  const handler = handlers[mode] || generateSQL;
  const result = handler({
    engine,
    input
  });

  const notes = [
    "Resultado generado con proveedor local/fake.",
    "Podés activar Ollama cambiando AI_PROVIDER=ollama en el archivo .env."
  ];

  if (providerError) {
    notes.push(`Fallback activado por error del proveedor IA: ${providerError}`);
  }

  return {
    result: result.result,
    explanation: result.explanation,
    notes: [
      ...notes,
      ...result.notes
    ],
    provider: providerError ? "fake-fallback" : "fake"
  };
}

function generateSQL({ engine, input }) {
  const text = input.toLowerCase();

  if (text.includes("factura") || text.includes("vencid")) {
    return {
      result: buildFacturaQuery(engine),
      explanation:
        "Se generó una consulta para listar facturas vencidas con datos del cliente, importe, vencimiento y estado.",
      notes: [
        "Se asume una tabla facturas vinculada a clientes por cliente_id.",
        "Conviene indexar fecha_vencimiento, estado y cliente_id."
      ]
    };
  }

  if (text.includes("cliente") && text.includes("pedido")) {
    return {
      result: buildClientesPedidosQuery(engine),
      explanation:
        "Se generó una consulta de clientes con cantidad de pedidos y fecha del último pedido.",
      notes: [
        "Se usa LEFT JOIN para no perder clientes sin pedidos.",
        "Se agrupa por columnas principales del cliente."
      ]
    };
  }

  if (text.includes("proveedor")) {
    return {
      result: buildProveedoresQuery(engine),
      explanation:
        "Se generó una consulta para listar proveedores activos ordenados por fecha de creación.",
      notes: [
        "Se evita SELECT * para mantener control de columnas.",
        "El filtro por estado ayuda a separar registros activos e inactivos."
      ]
    };
  }

  if (text.includes("tecnico") || text.includes("técnico") || text.includes("orden")) {
    return {
      result: buildTecnicosOrdenesQuery(engine),
      explanation:
        "Se generó una consulta para medir órdenes cerradas por técnico durante el mes actual.",
      notes: [
        "La expresión de fecha puede requerir ajustes según el motor SQL.",
        "Recomendado indexar tecnico_id, estado y fecha_cierre."
      ]
    };
  }

  const tableName = detectMainTableName(input) || "tabla_principal";

  return {
    result: `SELECT
  id,
  nombre,
  estado,
  created_at
FROM ${tableName}
WHERE estado = 'activo'
ORDER BY created_at DESC
LIMIT 100;`,
    explanation:
      "Se generó una consulta base adaptable para listar registros activos.",
    notes: [
      "Reemplazá tabla_principal por el nombre real de la tabla.",
      "Agregá filtros específicos según el caso de negocio."
    ]
  };
}

function explainSQL({ input }) {
  const clean = input.trim();

  return {
    result: `Análisis de consulta SQL

Consulta recibida:
${clean}

Lectura funcional:
La consulta obtiene información desde una o más tablas, aplica condiciones de filtrado si existe una cláusula WHERE y puede ordenar, agrupar o limitar resultados según las cláusulas utilizadas.

Puntos técnicos a revisar:
1. Confirmar que las columnas seleccionadas existan.
2. Revisar si los campos usados en WHERE tienen índices.
3. Validar que los JOIN no multipliquen registros de forma inesperada.
4. Evitar SELECT * en entornos productivos.
5. Agregar LIMIT cuando la consulta pueda devolver demasiados registros.`,
    explanation:
      "Explicación generada en modo local para facilitar la lectura técnica de una consulta SQL.",
    notes: [
      "El análisis local no ejecuta la consulta.",
      "Para diagnóstico avanzado conviene revisar EXPLAIN ANALYZE en la base real."
    ]
  };
}

function optimizeSQL({ engine, input }) {
  const tableName = detectMainTableName(input) || "tabla_principal";

  return {
    result: `-- Versión sugerida
SELECT
  id,
  nombre,
  estado,
  created_at
FROM ${tableName}
WHERE estado = 'activo'
ORDER BY created_at DESC
LIMIT 100;

-- Índice sugerido
${buildIndexStatement(engine, tableName, ["estado", "created_at"])}`,
    explanation:
      "Se propone limitar columnas, filtrar por estado, ordenar por fecha y agregar un índice compuesto.",
    notes: [
      "La optimización real depende del volumen de datos y del plan de ejecución.",
      "Revisá EXPLAIN o EXPLAIN ANALYZE antes de aplicar índices en producción.",
      "No todos los índices convienen: cada índice acelera lectura, pero agrega costo de escritura."
    ]
  };
}

function generateSchema({ engine, input }) {
  const tableName = detectMainTableName(input) || "proveedores";

  if (engine === "mysql") {
    return {
      result: `CREATE TABLE ${tableName} (
  id CHAR(36) PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(32) NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL
);`,
      explanation:
        "Schema base generado para MySQL con identificador UUID textual y timestamps.",
      notes: [
        "Podés adaptar id a BIGINT AUTO_INCREMENT si preferís ids numéricos.",
        "Agregá UNIQUE para campos como CUIT, email o código interno si corresponde."
      ]
    };
  }

  if (engine === "sqlite") {
    return {
      result: `CREATE TABLE ${tableName} (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL DEFAULT 'activo',
  created_at TEXT NOT NULL,
  updated_at TEXT
);`,
      explanation:
        "Schema base generado para SQLite usando TEXT para fechas e identificadores.",
      notes: [
        "SQLite no fuerza tipos de la misma manera que PostgreSQL o MySQL.",
        "Conviene generar los UUID desde la aplicación."
      ]
    };
  }

  if (engine === "sqlserver") {
    return {
      result: `CREATE TABLE ${tableName} (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  nombre NVARCHAR(160) NOT NULL,
  descripcion NVARCHAR(MAX) NULL,
  estado NVARCHAR(32) NOT NULL DEFAULT 'activo',
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL
);`,
      explanation:
        "Schema base generado para SQL Server con UNIQUEIDENTIFIER y DATETIME2.",
      notes: [
        "Podés cambiar NEWID por NEWSEQUENTIALID si priorizás performance de índices.",
        "Agregá constraints específicos según reglas de negocio."
      ]
    };
  }

  return {
    result: `CREATE TABLE ${tableName} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL DEFAULT 'activo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX idx_${tableName}_estado
ON ${tableName} (estado);`,
    explanation:
      "Schema base generado para PostgreSQL con UUID, timestamps e índice por estado.",
    notes: [
      "Requiere extensión pgcrypto para gen_random_uuid().",
      "Podés ejecutar: CREATE EXTENSION IF NOT EXISTS pgcrypto;"
    ]
  };
}

function buildProveedoresQuery() {
  return `SELECT
  id,
  nombre,
  cuit,
  correo,
  telefono,
  estado,
  created_at
FROM proveedores
WHERE estado = 'activo'
ORDER BY created_at DESC
LIMIT 100;`;
}

function buildFacturaQuery(engine) {
  if (engine === "mysql") {
    return `SELECT
  f.id,
  f.numero,
  c.nombre AS cliente,
  f.importe_total,
  f.fecha_vencimiento,
  f.estado
FROM facturas f
INNER JOIN clientes c ON c.id = f.cliente_id
WHERE f.estado <> 'pagada'
  AND f.fecha_vencimiento < CURRENT_DATE()
ORDER BY f.fecha_vencimiento ASC;`;
  }

  if (engine === "sqlserver") {
    return `SELECT
  f.id,
  f.numero,
  c.nombre AS cliente,
  f.importe_total,
  f.fecha_vencimiento,
  f.estado
FROM facturas f
INNER JOIN clientes c ON c.id = f.cliente_id
WHERE f.estado <> 'pagada'
  AND f.fecha_vencimiento < CAST(GETDATE() AS DATE)
ORDER BY f.fecha_vencimiento ASC;`;
  }

  return `SELECT
  f.id,
  f.numero,
  c.nombre AS cliente,
  f.importe_total,
  f.fecha_vencimiento,
  f.estado
FROM facturas f
INNER JOIN clientes c ON c.id = f.cliente_id
WHERE f.estado <> 'pagada'
  AND f.fecha_vencimiento < CURRENT_DATE
ORDER BY f.fecha_vencimiento ASC;`;
}

function buildClientesPedidosQuery() {
  return `SELECT
  c.id,
  c.nombre,
  c.cuit,
  COUNT(p.id) AS total_pedidos,
  MAX(p.created_at) AS ultimo_pedido
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nombre, c.cuit
ORDER BY total_pedidos DESC;`;
}

function buildTecnicosOrdenesQuery(engine) {
  if (engine === "mysql") {
    return `SELECT
  t.id,
  t.nombre,
  COUNT(o.id) AS ordenes_cerradas
FROM tecnicos t
LEFT JOIN ordenes_trabajo o ON o.tecnico_id = t.id
WHERE o.estado = 'cerrada'
  AND o.fecha_cierre >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
GROUP BY t.id, t.nombre
ORDER BY ordenes_cerradas DESC;`;
  }

  if (engine === "sqlserver") {
    return `SELECT
  t.id,
  t.nombre,
  COUNT(o.id) AS ordenes_cerradas
FROM tecnicos t
LEFT JOIN ordenes_trabajo o ON o.tecnico_id = t.id
WHERE o.estado = 'cerrada'
  AND o.fecha_cierre >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
GROUP BY t.id, t.nombre
ORDER BY ordenes_cerradas DESC;`;
  }

  return `SELECT
  t.id,
  t.nombre,
  COUNT(o.id) AS ordenes_cerradas
FROM tecnicos t
LEFT JOIN ordenes_trabajo o ON o.tecnico_id = t.id
WHERE o.estado = 'cerrada'
  AND o.fecha_cierre >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY t.id, t.nombre
ORDER BY ordenes_cerradas DESC;`;
}

function buildIndexStatement(engine, tableName, columns) {
  const indexName = `idx_${tableName}_${columns.join("_")}`;

  if (engine === "sqlserver") {
    return `CREATE INDEX ${indexName}
ON ${tableName} (${columns.join(", ")});`;
  }

  return `CREATE INDEX ${indexName}
ON ${tableName} (${columns.join(", ")});`;
}

module.exports = {
  generate
};