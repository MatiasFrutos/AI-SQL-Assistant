"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes/index.routes");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || "development";

app.disable("x-powered-by");

app.use(cors({
  origin(origin, callback) {
    const allowed = String(process.env.CORS_ORIGIN || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!origin) {
      return callback(null, true);
    }

    if (!allowed.length || allowed.includes(origin) || allowed.includes("*")) {
      return callback(null, true);
    }

    return callback(new Error(`CORS bloqueado para origen: ${origin}`));
  },
  credentials: true
}));

app.use(express.json({
  limit: "2mb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "2mb"
}));

if (NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    name: "SQLMind Local API",
    status: "online",
    docs: "/api/health"
  });
});

app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("============================================================");
  console.log(" SQLMIND LOCAL API");
  console.log("============================================================");
  console.log(` Estado:     online`);
  console.log(` Entorno:    ${NODE_ENV}`);
  console.log(` Puerto:     ${PORT}`);
  console.log(` Health:     http://localhost:${PORT}/api/health`);
  console.log("============================================================");
});