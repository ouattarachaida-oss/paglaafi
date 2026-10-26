@echo off
chcp 65001 >nul
title PagLaafi - Serveur Local Mobile
cls
echo ======================================================================
echo           DÉMARRAGE DU SERVEUR LOCAL - PAGLAAFI BURKINA FASO
echo ======================================================================
echo.
cd /d "%~dp0"

echo [1/2] Détection automatique de votre adresse IP réseau...
set "LOCAL_IP=192.168.1.22"
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress" 2^>nul`) do (
    if not "%%i"=="" set "LOCAL_IP=%%i"
)

echo.
echo ======================================================================
echo   Adresses d'accès disponibles :
echo    - Sur cet ordinateur : http://localhost:5173/
echo    - Pour smartphones   : http://%LOCAL_IP%:5173/
echo ======================================================================
echo.

echo [2/2] Ouverture automatique de PagLaafi dans votre navigateur...
start "" "http://localhost:5173/"

echo.
echo Lancement du serveur Vite PagLaafi...
echo (Laissez cette fenêtre ouverte pendant que vous utilisez l'application)
echo.

call pnpm --filter @workspace/mockup-sandbox run dev:lan
if %ERRORLEVEL% NEQ 0 (
    call npx pnpm --filter @workspace/mockup-sandbox run dev:lan
)
if %ERRORLEVEL% NEQ 0 (
    cd artifacts\mockup-sandbox
    call npx vite dev --host
)

pause
