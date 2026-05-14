# 🧠 SQLMind Local

<p align="center">
  <strong>⚡ AI SQL Assistant · Local First</strong>
</p>

<p align="center">
  Generá, explicá, optimizá y documentá SQL desde una interfaz local, simple y moderna.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-MVP%20funcional-brightgreen" />
  <img src="https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933" />
  <img src="https://img.shields.io/badge/frontend-Vanilla%20JS-F7DF1E" />
  <img src="https://img.shields.io/badge/AI-Fake%20Local%20%7C%20Ollama-7C3AED" />
  <img src="https://img.shields.io/badge/storage-JSON%20Local-blue" />
  <img src="https://img.shields.io/badge/license-MIT-black" />
</p>

---

## 🚀 ¿Qué es SQLMind Local?

**SQLMind Local** es una herramienta tipo workbench para trabajar con SQL usando asistencia IA local.

Está pensada para developers, analistas, estudiantes y equipos técnicos que necesitan crear consultas, entender queries heredadas, optimizar SQL o generar schemas sin depender de una plataforma externa.

Funciona en modo **local-first**:

- ✅ Corre en tu máquina.
- ✅ Puede funcionar con proveedor fake/local.
- ✅ Puede conectarse a modelos locales mediante Ollama.
- ✅ Guarda historial en JSON.
- ✅ Permite cambiar proveedor y modelo IA desde la interfaz.

---

## 🧩 Problema que resuelve

Trabajar con SQL muchas veces implica tareas repetitivas:

"Necesito una query para listar clientes activos..."
"¿Qué hace esta consulta enorme que heredé?"
"¿Cómo optimizo este SELECT?"
"Necesito un CREATE TABLE para proveedores..."
"Quiero probar distintos modelos IA locales..."

SQLMind Local centraliza esas tareas en una interfaz clara, sin vueltas y sin convertir cada query en una expedición arqueológica por el legacy.

---

## ✨ Funciones principales

### ⚡ Generar SQL desde texto natural

Escribís lo que necesitás y la herramienta devuelve una consulta SQL base.

Entrada ejemplo:

Necesito listar proveedores activos ordenados por fecha de alta.

Salida ejemplo:

SELECT
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
LIMIT 100;

---

### 📘 Explicar consultas SQL

Pegás una query existente y SQLMind devuelve una explicación clara:

- Qué hace la consulta.
- Qué tablas participan.
- Qué filtros aplica.
- Qué riesgos técnicos puede tener.
- Qué debería revisar un developer.

Ideal para entender consultas heredadas sin invocar al comité de emergencia del pasado.

---

### 🚀 Optimizar SQL

Permite revisar consultas y obtener sugerencias como:

- Evitar SELECT *.
- Agregar LIMIT cuando corresponde.
- Sugerir índices.
- Revisar JOINs.
- Detectar filtros débiles.
- Mejorar legibilidad.

Ejemplo de salida:

SELECT
  id,
  nombre,
  estado,
  created_at
FROM proveedores
WHERE estado = 'activo'
ORDER BY created_at DESC
LIMIT 100;

CREATE INDEX idx_proveedores_estado_created_at
ON proveedores (estado, created_at);

---

### 🧱 Schema Builder

Describís una entidad y SQLMind genera un CREATE TABLE.

Entrada ejemplo:

Entidad: proveedores

Campos:
nombre requerido,
cuit opcional,
correo,
telefono,
estado activo/inactivo,
fecha de alta.

Salida ejemplo:

CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cuit TEXT,
  correo TEXT,
  telefono TEXT,
  estado TEXT NOT NULL DEFAULT 'activo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

---

### 🗂 Historial local

Cada resultado generado queda guardado en historial.

Permite:

- Revisar consultas anteriores.
- Copiar resultados.
- Mantener trazabilidad básica.
- Limpiar historial cuando sea necesario.

---

### ⚙ Configuración IA editable

Desde la interfaz podés cambiar:

- Proveedor IA activo.
- Modelo IA activo.
- Lista de proveedores disponibles.
- Lista de modelos por proveedor.

Proveedores iniciales:

fake
ollama

Modelos iniciales:

local-fake
qwen2.5:0.5b
qwen2.5:1.5b
llama3.2:1b
llama3.2:3b
mistral:7b

---

## 🧠 Proveedores IA

### 🧪 Fake Local

Modo por defecto.

Sirve para:

- Probar la interfaz sin instalar IA.
- Validar el backend.
- Hacer demos rápidas.
- Usar el sistema aunque Ollama no esté disponible.

---

### 🦙 Ollama

Permite usar modelos locales.

ollama pull qwen2.5:0.5b
ollama serve

Luego podés seleccionar el proveedor y modelo desde:

IA Config

---

## 🏗 Arquitectura

sqlmind-local/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── data/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── app.js
│       ├── core/
│       ├── services/
│       ├── components/
│       ├── pages/
│       └── styles/
│
├── README.md
├── start-backend.bat
├── start-frontend.bat
└── .gitignore

---

## 🛠 Stack técnico

### Frontend

HTML5
CSS3
JavaScript Vanilla
ES Modules
Hash Router
LocalStorage
Responsive UI

### Backend

Node.js
Express
CORS
Morgan
Dotenv
JSON Storage
REST API

### IA

Fake Provider local
Ollama Provider opcional
Catálogo editable de proveedores/modelos

---

## 📦 Instalación

### 1. Clonar o abrir el proyecto

cd sqlmind-local

### 2. Instalar dependencias del backend

cd backend
npm install

---

## ▶ Ejecutar el proyecto

### Backend

Desde la raíz:

start-backend.bat

O manualmente:

cd backend
npm run dev

Backend disponible en:

http://localhost:3000

Healthcheck:

http://localhost:3000/api/health

---

### Frontend

Desde la raíz:

start-frontend.bat

O abrir con Live Server:

frontend/index.html

Frontend recomendado:

http://127.0.0.1:5500

---

## 🌐 Endpoints disponibles

### Health

GET /api/health

### Assistant

POST /api/assistant/generate
POST /api/assistant/explain
POST /api/assistant/optimize
POST /api/assistant/schema

### History

GET    /api/history
GET    /api/history/:id
DELETE /api/history
DELETE /api/history/:id

### AI Config

GET /api/ai-config
PUT /api/ai-config
PUT /api/ai-config/catalog

---

## 🧪 Ejemplos para probar

### Generar SQL

{
  "engine": "postgresql",
  "input": "Necesito listar proveedores activos ordenados por fecha de alta"
}

### Explicar SQL

{
  "engine": "postgresql",
  "input": "SELECT id, nombre, estado FROM proveedores WHERE estado = 'activo';"
}

### Optimizar SQL

{
  "engine": "postgresql",
  "input": "SELECT * FROM proveedores WHERE estado = 'activo' ORDER BY created_at DESC;"
}

### Crear schema

{
  "engine": "postgresql",
  "input": "Crear tabla proveedores con nombre, cuit, correo, telefono, estado y fecha de alta"
}

---

## ⚙ Configuración IA

Archivo editable:

backend/src/data/ai-config.json

Ejemplo:

{
  "activeProvider": "fake",
  "activeModel": "local-fake",
  "providers": [
    {
      "value": "fake",
      "label": "Fake Local",
      "enabled": true
    },
    {
      "value": "ollama",
      "label": "Ollama",
      "enabled": true
    }
  ],
  "models": {
    "fake": [
      "local-fake"
    ],
    "ollama": [
      "qwen2.5:0.5b",
      "qwen2.5:1.5b",
      "llama3.2:1b",
      "llama3.2:3b",
      "mistral:7b"
    ]
  }
}

---

## 🔐 Variables de entorno

Crear archivo:

backend/.env

Base sugerida:

PORT=3000
NODE_ENV=development

CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500,null

AI_PROVIDER=fake

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:0.5b
OLLAMA_TIMEOUT_MS=30000

HISTORY_MAX_ITEMS=200

---

## 🦙 Usar Ollama

### Instalar Ollama

https://ollama.com

### Descargar un modelo

ollama pull qwen2.5:0.5b

### Ver modelos instalados

ollama list

### Levantar Ollama

ollama serve

### Cambiar proveedor

Desde la app:

IA Config → Proveedor activo → Ollama

---

## 📊 Motores SQL soportados

PostgreSQL
MySQL
SQLite
SQL Server

---

## 📁 Datos locales

SQLMind usa archivos JSON para almacenamiento simple.

backend/src/data/history.json
backend/src/data/ai-config.json

Esto permite correr el MVP sin base de datos real.

---

## 🧭 Flujo de uso recomendado

1. Ejecutar start-backend.bat
2. Ejecutar start-frontend.bat
3. Entrar al Dashboard
4. Ir a IA Config
5. Confirmar proveedor/modelo activo
6. Generar SQL
7. Revisar resultado
8. Copiar query
9. Consultar historial

---

## 🧪 Modo demo

El proyecto funciona aunque no tengas Ollama instalado.

En ese caso, el proveedor fake genera respuestas base para probar:

- UI.
- Navegación.
- Endpoints.
- Historial.
- Configuración IA.
- Flujo completo de usuario.

Perfecto para portfolio, demo técnica o primera validación de producto.

---

## 🧩 Casos de uso reales

SQLMind Local puede servir para:

- Practicar SQL.
- Generar consultas base para módulos ERP/CRM.
- Documentar queries heredadas.
- Analizar consultas antes de llevarlas a producción.
- Probar modelos IA locales.
- Crear schemas iniciales.
- Armar ejemplos para proyectos técnicos.
- Enseñar SQL de forma guiada.

---

## 🧱 Ideas de evolución

- [ ] Ejecutar consultas contra PostgreSQL real.
- [ ] Cargar conexión de base de datos desde UI.
- [ ] Ejecutar EXPLAIN / EXPLAIN ANALYZE.
- [ ] Exportar historial a Markdown.
- [ ] Exportar historial a JSON.
- [ ] Comparar respuestas entre modelos IA.
- [ ] Guardar prompts favoritos.
- [ ] Crear workspaces por proyecto.
- [ ] Agregar plantillas por área.
- [ ] Agregar modo documentación automática.
- [ ] Agregar análisis de schemas existentes.
- [ ] Agregar importación de archivos .sql.

---

## 🧠 Filosofía del proyecto

Local first.
Simple de usar.
Fácil de extender.
Sin vendor lock-in.
Pensado para developers reales.
Diseñado para convertir tareas repetitivas en flujo operativo.

---

## 🖼 Vista conceptual

┌─────────────────────────────────────────────────────────────┐
│ SQLMind Local                                               │
├─────────────────────────────────────────────────────────────┤
│ Dashboard       Generar SQL       Optimizar       IA Config │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Entrada natural / SQL                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Necesito listar proveedores activos...                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Resultado                                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ SELECT id, nombre, estado FROM proveedores...          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

---

## ✅ Estado actual

Versión: 1.0.0
Estado: MVP funcional
Frontend: completo
Backend: completo
IA local fake: disponible
Ollama: preparado
Historial: JSON local
Configuración IA: editable desde UI

---

## 👨‍💻 Autor

Matias Isaac Frutos González  
Zernyx Tech Studio

---

## 📄 Licencia

MIT

---

## ⭐ SQLMind Local

Un asistente SQL local para construir, entender y mejorar consultas sin salir de tu entorno.
