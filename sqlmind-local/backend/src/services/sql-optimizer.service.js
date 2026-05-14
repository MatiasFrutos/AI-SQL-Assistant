"use strict";

const fakeAIProvider = require("../providers/fake-ai.provider");
const ollamaProvider = require("../providers/ollama.provider");
const aiConfigService = require("./ai-config.service");

async function optimize(payload) {
  const prompt = buildOptimizePrompt(payload);
  const provider = await aiConfigService.getActiveProvider();
  const model = await aiConfigService.getActiveModel();

  if (provider === "ollama") {
    try {
      return await ollamaProvider.generate({
        mode: "optimize",
        model,
        engine: payload.engine,
        input: payload.input,
        prompt
      });
    } catch (error) {
      return fakeAIProvider.generate({
        mode: "optimize",
        engine: payload.engine,
        input: payload.input,
        providerError: error.message
      });
    }
  }

  return fakeAIProvider.generate({
    mode: "optimize",
    engine: payload.engine,
    input: payload.input
  });
}

function buildOptimizePrompt(payload) {
  return `
Sos un especialista en performance SQL.

Motor SQL:
${payload.engine}

Consulta o contexto:
${payload.input}

Tarea:
- Proponer una versión mejorada.
- Sugerir índices si aplica.
- Explicar brevemente por qué mejora.
- Señalar riesgos como SELECT *, joins sin índices, filtros débiles o falta de LIMIT.

Formato:
SQL optimizado + notas técnicas.
`.trim();
}

module.exports = {
  optimize
};