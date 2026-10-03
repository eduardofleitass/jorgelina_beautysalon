@echo off
chcp 65001 >nul
title Jorgelina Coiffure - Servidor
cd /d "%~dp0..\..\backend"

echo.
echo ===============================================
echo   Jorgelina Coiffure - Servidor local
echo ===============================================
echo.

if not exist "dist\main.js" (
    echo   Falta compilar. Correr primero:
    echo      deploy\windows\build.ps1
    echo.
    pause
    exit /b 1
)

if not exist ".env" (
    echo   Falta el archivo .env. Correr primero:
    echo      deploy\windows\build.ps1
    echo.
    pause
    exit /b 1
)

rem Leer el puerto del .env (default 3001)
set PUERTO=3001
for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" .env') do set PUERTO=%%b

rem Verificar si el puerto ya esta ocupado
netstat -ano | findstr ":%PUERTO% " | findstr LISTENING >nul
if %errorlevel%==0 (
    echo   El puerto %PUERTO% ya esta ocupado.
    echo.
    echo   Puede que el sitio ya este corriendo. Probar abrir:
    echo      http://localhost:%PUERTO%
    echo.
    echo   Para ver que proceso lo tiene:
    echo      netstat -ano ^| findstr :%PUERTO%
    echo.
    pause
    exit /b 1
)

echo   Iniciando en http://localhost:%PUERTO%
echo   (cerrar esta ventana para detenerlo)
echo.

rem Mostrar IPs de acceso para otros equipos
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%i
    setlocal enabledelayedexpansion
    set IP=!IP: =!
    echo   Otros equipos:  http://!IP!:%PUERTO%
    endlocal
)
echo.

set NODE_ENV=production
node dist\main.js

echo.
echo   Servidor detenido.
pause
