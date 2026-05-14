"use strict";

export const APP_CONFIG = {
  appName: "SQLMind Local",
  appVersion: "1.0.0",
  apiBaseUrl: "http://localhost:3000/api",
  defaultEngine: "postgresql",
  timeoutMs: 20000,
  storageKeys: {
    localHistory: "sqlmind_local_history",
    theme: "sqlmind_theme"
  }
};

export const SQL_ENGINES = [
  {
    value: "postgresql",
    label: "PostgreSQL"
  },
  {
    value: "mysql",
    label: "MySQL"
  },
  {
    value: "sqlite",
    label: "SQLite"
  },
  {
    value: "sqlserver",
    label: "SQL Server"
  }
];

export const ASSISTANT_MODES = {
  generate: "generate",
  explain: "explain",
  optimize: "optimize",
  schema: "schema"
};