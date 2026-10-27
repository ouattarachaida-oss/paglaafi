@echo off
chcp 65001 >nul
title PagLaafi - Serveur Local Mobile (Vite)
cls
echo ======================================================================
echo           DÉMARRAGE DU SERVEUR LOCAL - PAGLAAFI BURKINA FASO
echo ======================================================================
echo.
cd /d "%~dp0"

echo [1/3] Détection automatique de votre adresse IP réseau...
set "LOCAL_IP=adresse-IP-de-cet-ordinateur"
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

echo [2/3] Ouverture automatique de PagLaafi dans votre navigateur...
start "" "http://localhost:5173/"

echo.
echo [3/3] Lancement du moteur Vite (PagLaafi Mobile)...
echo ======================================================================
echo   Le serveur est actif. Laissez cette fenêtre ouverte pendant vos tests.
echo   Appuyez sur Ctrl+C pour arrêter le serveur lorsque vous avez terminé.
echo ======================================================================
echo.

call pnpm --filter @workspace/mockup-sandbox run dev:lan
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tentative alternative avec npx pnpm...
    call npx pnpm --filter @workspace/mockup-sandbox run dev:lan
)
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tentative alternative avec npm...
    cd artifacts\mockup-sandbox
    call npx vite dev --host
)

echo.
echo ======================================================================
echo Le serveur s'est arrêté.
echo ======================================================================
pause
