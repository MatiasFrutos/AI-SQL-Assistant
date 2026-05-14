# 🧠 SQLMind Local

<p align="center">
  <strong>⚡ AI SQL Assistant · Local First</strong>
</p>

<p align="center">
  Generate, explain, optimize, and document SQL from a clean, modern, local interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-Functional%20MVP-brightgreen" />
  <img src="https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933" />
  <img src="https://img.shields.io/badge/frontend-Vanilla%20JS-F7DF1E" />
  <img src="https://img.shields.io/badge/AI-Fake%20Local%20%7C%20Ollama-7C3AED" />
  <img src="https://img.shields.io/badge/storage-Local%20JSON-blue" />
  <img src="https://img.shields.io/badge/license-MIT-black" />
</p>

---

## 🚀 What is SQLMind Local?

**SQLMind Local** is a local-first SQL workbench powered by configurable AI providers.

It is designed for developers, analysts, students, and technical teams that need to generate queries, understand inherited SQL, optimize statements, create database schemas, and test local AI models without depending on an external cloud platform.

SQLMind Local runs as a lightweight fullstack project:

- ✅ Runs on your own machine.
- ✅ Works with a fake/local AI provider by default.
- ✅ Can connect to local models through Ollama.
- ✅ Saves query history in local JSON files.
- ✅ Allows provider and model configuration from the UI.
- ✅ Keeps the project simple, portable, and easy to extend.

---

## 🧩 The Problem It Solves

Working with SQL often involves repetitive tasks:

"Write a query to list active customers..."
"What does this legacy query actually do?"
"How can I optimize this SELECT?"
"I need a CREATE TABLE for suppliers..."
"I want to test different local AI models..."

SQLMind Local centralizes those workflows into one practical interface.

No vendor lock-in.
No heavy setup.
No unnecessary complexity.
Just a focused local assistant for SQL productivity.

---

## ✨ Core Features

### ⚡ Generate SQL from Natural Language

Write what you need, and SQLMind returns a clean SQL query.

Input example:

    I need to list active suppliers ordered by creation date.

Output example:

    SELECT
      id,
      name,
      tax_id,
      email,
      phone,
      status,
      created_at
    FROM suppliers
    WHERE status = 'active'
    ORDER BY created_at DESC
    LIMIT 100;

---

### 📘 Explain SQL Queries

Paste an existing SQL query and get a clear explanation.

SQLMind can help explain:

- What the query does.
- Which tables are involved.
- Which filters are applied.
- Which technical risks may exist.
- What a developer should review before using it.

Useful for understanding inherited queries without calling an emergency legacy meeting.

---

### 🚀 Optimize SQL

Review a query and get practical improvement suggestions.

SQLMind can suggest:

- Avoiding SELECT *.
- Adding LIMIT when needed.
- Creating indexes.
- Reviewing JOINs.
- Detecting weak filters.
- Improving readability.
- Preparing the query for production review.

Output example:

    SELECT
      id,
      name,
      status,
      created_at
    FROM suppliers
    WHERE status = 'active'
    ORDER BY created_at DESC
    LIMIT 100;

    CREATE INDEX idx_suppliers_status_created_at
    ON suppliers (status, created_at);

---

### 🧱 Schema Builder

Describe an entity and generate a CREATE TABLE statement.

Input example:

    Entity: suppliers

    Fields:
    required name,
    optional tax id,
    email,
    phone,
    active/inactive status,
    creation date.

Output example:

    CREATE TABLE suppliers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      tax_id TEXT,
      email TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    );

---

### 🗂 Local History

Every generated result is stored in local history.

The history module allows you to:

- Review previous queries.
- Copy generated results.
- Keep basic traceability.
- Clear stored history when needed.

---

### ⚙ Editable AI Configuration

From the UI, you can change:

- Active AI provider.
- Active AI model.
- Available provider list.
- Available model list per provider.

Initial providers:

    fake
    ollama

Initial models:

    local-fake
    qwen2.5:0.5b
    qwen2.5:1.5b
    llama3.2:1b
    llama3.2:3b
    mistral:7b

---

## 🧠 AI Providers

### 🧪 Fake Local Provider

Default mode.

Useful for:

- Testing the interface without installing AI tools.
- Validating backend endpoints.
- Running quick demos.
- Using the app even when Ollama is not available.
- Keeping the MVP fully functional from day one.

---

### 🦙 Ollama Provider

Allows SQLMind Local to use local AI models through Ollama.

Example:

    ollama pull qwen2.5:0.5b
    ollama serve

Then select the provider and model from:

    AI Config

---

## 🏗 Architecture

SQLMind Local follows a simple modular fullstack architecture.

The frontend is a Vanilla JavaScript SPA with reusable components, services, pages, and a hash router.

The backend is a Node.js + Express REST API with controllers, routes, services, providers, utilities, middlewares, and JSON-based local storage.

Architecture overview:

    ┌────────────────────────────────────────────────────────────────────┐
    │                            SQLMind Local                           │
    └────────────────────────────────────────────────────────────────────┘
                                      │
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
          ┌───────────────────┐               ┌───────────────────┐
          │     Frontend      │               │      Backend      │
          │  Vanilla JS SPA   │               │ Node.js + Express │
          └───────────────────┘               └───────────────────┘
                    │                                   │
                    │                                   │
          ┌─────────┴─────────┐              ┌──────────┴──────────┐
          │                   │              │                     │
          ▼                   ▼              ▼                     ▼
    ┌──────────┐       ┌──────────┐   ┌──────────────┐     ┌──────────────┐
    │  Pages   │       │ Services │   │ Controllers  │     │   Services   │
    └──────────┘       └──────────┘   └──────────────┘     └──────────────┘
          │                   │              │                     │
          ▼                   ▼              ▼                     ▼
    ┌──────────┐       ┌──────────┐   ┌──────────────┐     ┌──────────────┐
    │Components│       │ API Client│   │    Routes    │     │  Providers   │
    └──────────┘       └──────────┘   └──────────────┘     └──────────────┘
                                                              │
                                                              │
                                           ┌──────────────────┴──────────────────┐
                                           ▼                                     ▼
                                  ┌─────────────────┐                  ┌─────────────────┐
                                  │ Fake AI Provider│                  │ Ollama Provider │
                                  └─────────────────┘                  └─────────────────┘
                                           │                                     │
                                           ▼                                     ▼
                                  ┌─────────────────┐                  ┌─────────────────┐
                                  │  Local JSON DB  │                  │ Local AI Models │
                                  └─────────────────┘                  └─────────────────┘

Project structure:

    sqlmind-local/
    │
    ├── backend/
    │   │
    │   ├── src/
    │   │   │
    │   │   ├── controllers/
    │   │   │   ├── health.controller.js
    │   │   │   ├── assistant.controller.js
    │   │   │   ├── history.controller.js
    │   │   │   └── ai-config.controller.js
    │   │   │
    │   │   ├── routes/
    │   │   │   ├── index.routes.js
    │   │   │   ├── health.routes.js
    │   │   │   ├── assistant.routes.js
    │   │   │   ├── history.routes.js
    │   │   │   └── ai-config.routes.js
    │   │   │
    │   │   ├── services/
    │   │   │   ├── assistant.service.js
    │   │   │   ├── sql-generator.service.js
    │   │   │   ├── sql-explainer.service.js
    │   │   │   ├── sql-optimizer.service.js
    │   │   │   ├── sql-validator.service.js
    │   │   │   ├── history.service.js
    │   │   │   ├── storage.service.js
    │   │   │   └── ai-config.service.js
    │   │   │
    │   │   ├── providers/
    │   │   │   ├── fake-ai.provider.js
    │   │   │   └── ollama.provider.js
    │   │   │
    │   │   ├── middlewares/
    │   │   │   ├── error.middleware.js
    │   │   │   └── not-found.middleware.js
    │   │   │
    │   │   ├── utils/
    │   │   │   ├── id.util.js
    │   │   │   ├── date.util.js
    │   │   │   ├── sql.util.js
    │   │   │   └── response.util.js
    │   │   │
    │   │   ├── data/
    │   │   │   ├── history.json
    │   │   │   └── ai-config.json
    │   │   │
    │   │   └── server.js
    │   │
    │   ├── package.json
    │   └── .env.example
    │
    ├── frontend/
    │   │
    │   ├── index.html
    │   │
    │   └── src/
    │       ├── main.js
    │       ├── app.js
    │       │
    │       ├── core/
    │       │   ├── api.client.js
    │       │   ├── config.js
    │       │   └── router.js
    │       │
    │       ├── services/
    │       │   ├── assistant.service.js
    │       │   ├── history.service.js
    │       │   └── ai-config.service.js
    │       │
    │       ├── components/
    │       │   ├── navbar.js
    │       │   ├── sidebar.js
    │       │   ├── toast.js
    │       │   ├── loader.js
    │       │   ├── empty-state.js
    │       │   └── result-card.js
    │       │
    │       ├── pages/
    │       │   ├── dashboard.page.js
    │       │   ├── generate.page.js
    │       │   ├── explain.page.js
    │       │   ├── optimize.page.js
    │       │   ├── schema.page.js
    │       │   ├── history.page.js
    │       │   └── settings.page.js
    │       │
    │       └── styles/
    │           ├── base.css
    │           ├── layout.css
    │           ├── components.css
    │           ├── pages.css
    │           └── responsive.css
    │
    ├── README.md
    ├── start-backend.bat
    ├── start-frontend.bat
    └── .gitignore

---

## 🛠 Tech Stack

### Frontend

    HTML5
    CSS3
    Vanilla JavaScript
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

### AI Layer

    Fake local provider
    Optional Ollama provider
    Editable provider/model catalog

---

## 📦 Installation

### 1. Open the project

    cd sqlmind-local

### 2. Install backend dependencies

    cd backend
    npm install

---

## ▶ Run the Project

### Backend

From the project root:

    start-backend.bat

Or manually:

    cd backend
    npm run dev

Backend available at:

    http://localhost:3000

Healthcheck:

    http://localhost:3000/api/health

---

### Frontend

From the project root:

    start-frontend.bat

Or open with Live Server:

    frontend/index.html

Recommended frontend URL:

    http://127.0.0.1:5500

---

## 🌐 Available Endpoints

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

## 🧪 Test Examples

### Generate SQL

    {
      "engine": "postgresql",
      "input": "I need to list active suppliers ordered by creation date"
    }

### Explain SQL

    {
      "engine": "postgresql",
      "input": "SELECT id, name, status FROM suppliers WHERE status = 'active';"
    }

### Optimize SQL

    {
      "engine": "postgresql",
      "input": "SELECT * FROM suppliers WHERE status = 'active' ORDER BY created_at DESC;"
    }

### Create Schema

    {
      "engine": "postgresql",
      "input": "Create a suppliers table with name, tax id, email, phone, status, and creation date"
    }

---

## ⚙ AI Configuration

Editable file:

    backend/src/data/ai-config.json

Example:

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

## 🔐 Environment Variables

Create this file:

    backend/.env

Suggested base configuration:

    PORT=3000
    NODE_ENV=development

    CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500,null

    AI_PROVIDER=fake

    OLLAMA_BASE_URL=http://localhost:11434
    OLLAMA_MODEL=qwen2.5:0.5b
    OLLAMA_TIMEOUT_MS=30000

    HISTORY_MAX_ITEMS=200

---

## 🦙 Using Ollama

### Install Ollama

    https://ollama.com

### Pull a model

    ollama pull qwen2.5:0.5b

### List installed models

    ollama list

### Start Ollama

    ollama serve

### Change provider

From the app:

    AI Config → Active Provider → Ollama

---

## 📊 Supported SQL Engines

    PostgreSQL
    MySQL
    SQLite
    SQL Server

---

## 📁 Local Data

SQLMind uses JSON files as lightweight local storage.

    backend/src/data/history.json
    backend/src/data/ai-config.json

This keeps the MVP portable and database-free.

---

## 🧭 Recommended Usage Flow

    1. Run start-backend.bat
    2. Run start-frontend.bat
    3. Open the Dashboard
    4. Go to AI Config
    5. Confirm the active provider/model
    6. Generate SQL
    7. Review the result
    8. Copy the query
    9. Check the history

---

## 🧪 Demo Mode

The project works even if Ollama is not installed.

When using the fake provider, SQLMind can generate baseline responses to test:

- UI.
- Navigation.
- Endpoints.
- History.
- AI configuration.
- Full user workflow.

Perfect for portfolio demos, technical presentations, and early product validation.

---

## 🧩 Real Use Cases

SQLMind Local can be used to:

- Practice SQL.
- Generate starter queries for ERP/CRM modules.
- Document inherited SQL.
- Review queries before production usage.
- Test local AI models.
- Create initial schemas.
- Build examples for technical projects.
- Teach SQL in a guided way.

---

## 🧱 Roadmap Ideas

- [ ] Execute queries against a real PostgreSQL database.
- [ ] Add database connection setup from the UI.
- [ ] Run EXPLAIN / EXPLAIN ANALYZE.
- [ ] Export history to Markdown.
- [ ] Export history to JSON.
- [ ] Compare responses between AI models.
- [ ] Save favorite prompts.
- [ ] Create project workspaces.
- [ ] Add templates by business area.
- [ ] Add automatic documentation mode.
- [ ] Analyze existing database schemas.
- [ ] Import .sql files.

---

## 🧠 Project Philosophy

    Local first.
    Simple to use.
    Easy to extend.
    No vendor lock-in.
    Built for real developers.
    Designed to turn repetitive SQL tasks into a smoother workflow.

---

## 🖼 Conceptual View

    ┌──────────────────────────────────────────────────────────────────────────────┐
    │                              SQLMind Local                                  │
    │                    Local AI SQL Assistant · Developer Tool                  │
    └──────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────┐        ┌───────────────────────────────────┐
    │          User Input            │        │          AI Configuration          │
    │───────────────────────────────│        │───────────────────────────────────│
    │ Natural language request       │        │ Provider: fake / ollama            │
    │ Existing SQL query             │        │ Model: local-fake / qwen / llama   │
    │ Schema description             │        │ Editable provider catalog          │
    └───────────────┬───────────────┘        └─────────────────┬─────────────────┘
                    │                                          │
                    └───────────────────┬──────────────────────┘
                                        ▼
    ┌──────────────────────────────────────────────────────────────────────────────┐
    │                              SQLMind Engine                                 │
    │──────────────────────────────────────────────────────────────────────────────│
    │  Generate SQL     │  Explain SQL     │  Optimize SQL     │  Build Schema     │
    └───────────────────────────────────────┬──────────────────────────────────────┘
                                            ▼
    ┌──────────────────────────────────────────────────────────────────────────────┐
    │                                Result Panel                                 │
    │──────────────────────────────────────────────────────────────────────────────│
    │  Clean SQL output                                                           │
    │  Technical notes                                                            │
    │  Copy action                                                                │
    │  Local history                                                              │
    └──────────────────────────────────────────────────────────────────────────────┘

    Example workflow:

    User writes:
      "Create a query to list active suppliers ordered by creation date."

    SQLMind returns:
      SELECT
        id,
        name,
        status,
        created_at
      FROM suppliers
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT 100;

---

## ✅ Current Status

    Version: 1.0.0
    Status: Functional MVP
    Frontend: Complete
    Backend: Complete
    Fake local AI: Available
    Ollama: Ready
    History: Local JSON
    AI Configuration: Editable from UI

---

## 👨‍💻 Author

Matias Isaac Frutos Gonzalez  
Zernyx Tech Studio

---

## 📄 License

MIT

---

## ⭐ SQLMind Local

A local SQL assistant to build, understand, and improve queries without leaving your own environment.
