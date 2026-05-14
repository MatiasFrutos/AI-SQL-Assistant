"use strict";

const fakeAIProvider = require("../providers/fake-ai.provider");
const ollamaProvider = require("../providers/ollama.provider");
const aiConfigService = require("./ai-config.service");

async function generate(payload) {
  const prompt = buildGeneratePrompt(payload);

  return runProvider({
    mode: "generate",
    payload,
    prompt
  });
}

async function generateSchema(payload) {
  const prompt = buildSchemaPrompt(payload);

  return runProvider({
    mode: "schema",
    payload,
    prompt
  });
}

async function runProvider({ mode, payload, prompt }) {
  const provider = await aiConfigService.getActiveProvider();
  const model = await aiConfigService.getActiveModel();

  if (provider === "ollama") {
    try {
      const ollamaResult = await ollamaProvider.generate({
        mode,
        model,
        engine: payload.engine,
        input: payload.input,
        prompt
      });

      return ollamaResult;
    } catch (error) {
      return fakeAIProvider.generate({
        mode,
        engine: payload.engine,
        input: payload.input,
        providerError: error.message
      });
    }
  }

  return fakeAIProvider.generate({
    mode,
    engine: payload.engine,
    input: payload.input
  });
}

function buildGeneratePrompt(payload) {
  return `
Sos un asistente experto en SQL.

Objetivo:
Generar una consulta SQL clara, segura y mantenible.

Motor SQL:
${payload.engine}

Pedido del usuario:
${payload.input}

Reglas:
- Devolvé solo SQL y comentarios técnicos mínimos.
- No inventes columnas imposibles si el contexto no las menciona.
- Usá nombres de tablas y columnas razonables.
- Evitá SELECT * salvo que sea estrictamente necesario.
- Si aplica, agregá LIMIT.
- Si falta información, generá una query base adaptable.
`.trim();
}

function buildSchemaPrompt(payload) {
  return `
Sos un asistente experto en modelado de bases de datos.

Objetivo:
Generar un CREATE TABLE profesional.

Motor SQL:
${payload.engine}

Descripción:
${payload.input}

Reglas:
- Devolvé un CREATE TABLE completo.
- Usá tipos de datos correctos para el motor indicado.
- Agregá primary key.
- Agregá campos created_at y updated_at cuando aplique.
- Agregá constraints razonables.
- No agregues explicaciones extensas fuera del SQL.
`.trim();
}

module.exports = {
  generate,
  generateSchema
};