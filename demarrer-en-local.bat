@echo off
chcp 65001 >nul
title PagLaafi - Serveur Local Mobile
cls
echo ======================================================================
echo           DÉMARRAGE DU SERVEUR LOCAL - PAGLAAFI BURKINA FASO
echo ======================================================================
echo.
cd /d "%~dp0"

echo [1/3] Vérification de l'adresse IP et du port 5173...
echo  - Accès sur cet ordinateur : http://localhost:5173/
echo  - Accès collègues (Wi-Fi)  : http://192.168.1.88:5173/
echo.
echo [2/3] Ouverture automatique dans votre navigateur...
start "" "http://localhost:5173/"

echo.
echo [3/3] Lancement du moteur Vite (PinkHub Mobile)...
echo ======================================================================
echo   Le serveur est prêt. Laissez cette fenêtre ouverte pendant vos tests.
echo   Appuyez sur Ctrl+C pour arrêter le serveur lorsque vous avez terminé.
echo ======================================================================
echo.

call pnpm --filter @workspace/mockup-sandbox run dev
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tentative alternative avec npx pnpm...
    call npx pnpm --filter @workspace/mockup-sandbox run dev
)

echo.
echo ======================================================================
echo Le serveur s'est arrêté.
echo ======================================================================
pause
