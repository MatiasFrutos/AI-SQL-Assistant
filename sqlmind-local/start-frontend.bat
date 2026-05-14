@echo off
setlocal enabledelayedexpansion

title SQLMind Local - Frontend
color 0B

echo.
echo ============================================================
echo  SQLMIND LOCAL - FRONTEND
echo ============================================================
echo.

set ROOT_DIR=%~dp0
set FRONTEND_DIR=%ROOT_DIR%frontend
set INDEX_FILE=%FRONTEND_DIR%\index.html
set PORT=5500

if not exist "%FRONTEND_DIR%" (
  echo [ERROR] No se encontro la carpeta frontend.
  echo.
  echo Ruta esperada:
  echo %FRONTEND_DIR%
  echo.
  pause
  exit /b 1
)

if not exist "%INDEX_FILE%" (
  echo [ERROR] No se encontro frontend\index.html.
  echo.
  echo Verifica que la estructura del proyecto este completa.
  echo.
  pause
  exit /b 1
)

echo [OK] Frontend detectado.
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [INFO] Node.js no esta disponible en PATH.
  echo [INFO] Abriendo index.html directamente en el navegador...
  echo.
  start "" "%INDEX_FILE%"
  echo.
  echo [WARN] Algunas funciones pueden fallar por restricciones del navegador al abrir con file://.
  echo [RECOMENDADO] Instala Node.js o usa Live Server en VS Code.
  echo.
  pause
  exit /b 0
)

where npx >nul 2>nul
if errorlevel 1 (
  echo [INFO] npx no esta disponible.
  echo [INFO] Abriendo index.html directamente en el navegador...
  echo.
  start "" "%INDEX_FILE%"
  echo.
  echo [WARN] Algunas funciones pueden fallar por restricciones del navegador al abrir con file://.
  echo.
  pause
  exit /b 0
)

echo [INFO] Node detectado:
node -v

echo.
echo [INFO] npx detectado.
echo.

cd /d "%FRONTEND_DIR%"

echo ============================================================
echo  INICIANDO FRONTEND
echo ============================================================
echo.
echo URL:
echo http://127.0.0.1:%PORT%
echo.
echo Backend esperado:
echo http://localhost:3000/api
echo.
echo Recomendacion:
echo Ejecuta start-backend.bat en otra terminal antes de probar IA real.
echo.
echo Para detener el servidor presiona CTRL + C.
echo ============================================================
echo.

start "" "http://127.0.0.1:%PORT%"

npx --yes serve . -l %PORT%

echo.
echo [INFO] El proceso del frontend finalizo.
echo.
pause
endlocal