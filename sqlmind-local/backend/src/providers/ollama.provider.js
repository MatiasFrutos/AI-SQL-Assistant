"use strict";

async function generate(options = {}) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = options.model || process.env.OLLAMA_MODEL || "qwen2.5:0.5b";
  const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS || 30000);

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        prompt: options.prompt,
        stream: false,
        options: {
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      throw new Error(`OLLAMA_HTTP_${response.status}`);
    }

    const data = await response.json();

    const content = String(data.response || "").trim();

    return normalizeOllamaResponse({
      mode: options.mode,
      content,
      engine: options.engine,
      model
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("OLLAMA_TIMEOUT");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeOllamaResponse({ mode, content, model }) {
  if (!content) {
    return {
      result: "-- Ollama no devolvió contenido.",
      explanation: "No se recibió respuesta útil del modelo local.",
      notes: [
        "Verificá que Ollama esté corriendo.",
        `Modelo configurado: ${model}`
      ],
      provider: "ollama"
    };
  }

  if (mode === "explain") {
    return {
      result: content,
      explanation: `Explicación generada por modelo local mediante Ollama: ${model}.`,
      notes: [
        "La respuesta depende del modelo local configurado."
      ],
      provider: "ollama"
    };
  }

  return {
    result: cleanMarkdownSql(content),
    explanation: `Resultado generado por modelo local mediante Ollama: ${model}.`,
    notes: [
      "Revisá la consulta antes de ejecutarla en una base productiva.",
      "La IA puede requerir ajustes según nombres reales de tablas y columnas."
    ],
    provider: "ollama"
  };
}

function cleanMarkdownSql(value) {
  return String(value)
    .replace(/^```sql\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

module.exports = {
  generate
};