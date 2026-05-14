"use strict";

const fakeAIProvider = require("../providers/fake-ai.provider");
const ollamaProvider = require("../providers/ollama.provider");
const aiConfigService = require("./ai-config.service");

async function explain(payload) {
  const prompt = buildExplainPrompt(payload);
  const provider = await aiConfigService.getActiveProvider();
  const model = await aiConfigService.getActiveModel();

  if (provider === "ollama") {
    try {
      return await ollamaProvider.generate({
        mode: "explain",
        model,
        engine: payload.engine,
        input: payload.input,
        prompt
      });
    } catch (error) {
      return fakeAIProvider.generate({
        mode: "explain",
        engine: payload.engine,
        input: payload.input,
        providerError: error.message
      });
    }
  }

  return fakeAIProvider.generate({
    mode: "explain",
    engine: payload.engine,
    input: payload.input
  });
}

function buildExplainPrompt(payload) {
  return `
Sos un asistente experto en SQL.

Motor SQL:
${payload.engine}

Consulta:
${payload.input}

Explicá:
- Qué hace la consulta.
- Qué tablas parecen participar.
- Qué filtros aplica.
- Qué riesgos puede tener.
- Qué puntos debería revisar un developer.

Respuesta:
Usá lenguaje claro, técnico y práctico.
`.trim();
}

module.exports = {
  explain
};