
---

## `start-backend.bat`

```bat
@echo off
setlocal enabledelayedexpansion

title SQLMind Local - Backend
color 0A

echo.
echo ============================================================
echo  SQLMIND LOCAL - BACKEND
echo ============================================================
echo.

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%backend
set ENV_FILE=%BACKEND_DIR%\.env
set ENV_EXAMPLE_FILE=%BACKEND_DIR%\.env.example
set PACKAGE_FILE=%BACKEND_DIR%\package.json
set NODE_MODULES_DIR=%BACKEND_DIR%\node_modules

if not exist "%BACKEND_DIR%" (
  echo [ERROR] No se encontro la carpeta backend.
  echo.
  echo Ruta esperada:
  echo %BACKEND_DIR%
  echo.
  pause
  exit /b 1
)

if not exist "%PACKAGE_FILE%" (
  echo [ERROR] No se encontro backend\package.json.
  echo.
  echo Verifica que la estructura del proyecto este completa.
  echo.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js no esta instalado o no esta disponible en PATH.
  echo.
  echo Instala Node.js desde:
  echo https://nodejs.org
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm no esta instalado o no esta disponible en PATH.
  echo.
  pause
  exit /b 1
)

echo [INFO] Node detectado:
node -v

echo.
echo [INFO] npm detectado:
npm -v

echo.

if not exist "%ENV_FILE%" (
  if exist "%ENV_EXAMPLE_FILE%" (
    echo [INFO] No existe backend\.env.
    echo [INFO] Creando backend\.env desde backend\.env.example...
    copy "%ENV_EXAMPLE_FILE%" "%ENV_FILE%" >nul
    echo [OK] Archivo .env creado.
  ) else (
    echo [INFO] No existe .env.example. Creando .env basico...
    (
      echo PORT=3000
      echo NODE_ENV=development
      echo CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500,null
      echo AI_PROVIDER=fake
      echo OLLAMA_BASE_URL=http://localhost:11434
      echo OLLAMA_MODEL=qwen2.5:0.5b
      echo OLLAMA_TIMEOUT_MS=30000
      echo HISTORY_MAX_ITEMS=200
    ) > "%ENV_FILE%"
    echo [OK] Archivo .env creado.
  )
) else (
  echo [OK] Archivo backend\.env detectado.
)

echo.

cd /d "%BACKEND_DIR%"

if not exist "%NODE_MODULES_DIR%" (
  echo [INFO] No se encontro node_modules.
  echo [INFO] Instalando dependencias...
  echo.
  npm install

  if errorlevel 1 (
    echo.
    echo [ERROR] Fallo npm install.
    echo.
    pause
    exit /b 1
  )

  echo.
  echo [OK] Dependencias instaladas.
) else (
  echo [OK] node_modules detectado.
)

echo.
echo ============================================================
echo  INICIANDO BACKEND
echo ============================================================
echo.
echo API:
echo http://localhost:3000
echo.
echo Healthcheck:
echo http://localhost:3000/api/health
echo.
echo Endpoints principales:
echo GET  /api/ai-config
echo PUT  /api/ai-config
echo POST /api/assistant/generate
echo POST /api/assistant/explain
echo POST /api/assistant/optimize
echo POST /api/assistant/schema
echo GET  /api/history
echo.
echo Para detener el servidor presiona CTRL + C.
echo ============================================================
echo.

npm run dev

echo.
echo [INFO] El proceso del backend finalizo.
echo.
pause
endlocal