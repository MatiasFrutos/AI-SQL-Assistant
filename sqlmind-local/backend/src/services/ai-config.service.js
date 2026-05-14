"use strict";

const path = require("path");
const storageService = require("./storage.service");

const CONFIG_PATH = path.join(__dirname, "../data/ai-config.json");

const DEFAULT_CONFIG = {
  activeProvider: process.env.AI_PROVIDER || "fake",
  activeModel: process.env.OLLAMA_MODEL || "local-fake",
  providers: [
    {
      value: "fake",
      label: "Fake Local",
      enabled: true
    },
    {
      value: "ollama",
      label: "Ollama",
      enabled: true
    }
  ],
  models: {
    fake: ["local-fake"],
    ollama: [
      "qwen2.5:0.5b",
      "qwen2.5:1.5b",
      "llama3.2:1b",
      "llama3.2:3b",
      "mistral:7b"
    ]
  }
};

async function getConfig() {
  const config = await storageService.readJson(CONFIG_PATH, DEFAULT_CONFIG);

  return normalizeConfig(config);
}

async function updateActiveConfig(payload = {}) {
  const current = await getConfig();

  const provider = normalizeText(payload.activeProvider || current.activeProvider);
  const model = normalizeText(payload.activeModel || current.activeModel);

  const enabledProviders = current.providers
    .filter((item) => item.enabled)
    .map((item) => item.value);

  if (!enabledProviders.includes(provider)) {
    throw createBadRequest("AI_PROVIDER_NOT_ALLOWED");
  }

  const availableModels = current.models[provider] || [];

  if (!availableModels.includes(model)) {
    throw createBadRequest("AI_MODEL_NOT_ALLOWED_FOR_PROVIDER");
  }

  const nextConfig = {
    ...current,
    activeProvider: provider,
    activeModel: model
  };

  await storageService.writeJson(CONFIG_PATH, nextConfig);

  return nextConfig;
}

async function updateCatalog(payload = {}) {
  const providers = Array.isArray(payload.providers)
    ? payload.providers.map(normalizeProvider).filter(Boolean)
    : [];

  const models = normalizeModels(payload.models || {});

  if (!providers.length) {
    throw createBadRequest("AI_PROVIDERS_REQUIRED");
  }

  const activeProvider = normalizeText(payload.activeProvider || providers[0].value);

  if (!providers.some((provider) => provider.value === activeProvider)) {
    throw createBadRequest("ACTIVE_PROVIDER_NOT_FOUND_IN_LIST");
  }

  const activeModel = normalizeText(
    payload.activeModel ||
    models[activeProvider]?.[0] ||
    ""
  );

  if (!models[activeProvider] || !models[activeProvider].includes(activeModel)) {
    throw createBadRequest("ACTIVE_MODEL_NOT_FOUND_IN_PROVIDER_MODELS");
  }

  const nextConfig = {
    activeProvider,
    activeModel,
    providers,
    models
  };

  await storageService.writeJson(CONFIG_PATH, nextConfig);

  return nextConfig;
}

async function getActiveProvider() {
  const config = await getConfig();
  return config.activeProvider;
}

async function getActiveModel() {
  const config = await getConfig();
  return config.activeModel;
}

function normalizeConfig(config) {
  const safeConfig = config && typeof config === "object"
    ? config
    : DEFAULT_CONFIG;

  const providers = Array.isArray(safeConfig.providers) && safeConfig.providers.length
    ? safeConfig.providers.map(normalizeProvider).filter(Boolean)
    : DEFAULT_CONFIG.providers;

  const models = normalizeModels(safeConfig.models || DEFAULT_CONFIG.models);

  let activeProvider = normalizeText(safeConfig.activeProvider || DEFAULT_CONFIG.activeProvider);

  if (!providers.some((provider) => provider.value === activeProvider)) {
    activeProvider = providers[0]?.value || "fake";
  }

  let activeModel = normalizeText(safeConfig.activeModel || "");

  if (!models[activeProvider]?.includes(activeModel)) {
    activeModel = models[activeProvider]?.[0] || "local-fake";
  }

  return {
    activeProvider,
    activeModel,
    providers,
    models
  };
}

function normalizeProvider(provider) {
  if (!provider || typeof provider !== "object") {
    return null;
  }

  const value = normalizeText(provider.value);
  const label = normalizeText(provider.label || provider.value);

  if (!value || !label) {
    return null;
  }

  return {
    value,
    label,
    enabled: provider.enabled !== false
  };
}

function normalizeModels(models) {
  const output = {};

  Object.entries(models || {}).forEach(([provider, list]) => {
    const key = normalizeText(provider);

    if (!key || !Array.isArray(list)) {
      return;
    }

    output[key] = [...new Set(
      list
        .map((item) => normalizeText(item))
        .filter(Boolean)
    )];
  });

  if (!output.fake) {
    output.fake = ["local-fake"];
  }

  return output;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function createBadRequest(message) {
  const error = new Error(message || "BAD_REQUEST");
  error.statusCode = 400;
  return error;
}

module.exports = {
  getConfig,
  updateActiveConfig,
  updateCatalog,
  getActiveProvider,
  getActiveModel
};