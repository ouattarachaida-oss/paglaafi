@echo off
chcp 65001 >nul
title PagLaafi - Serveur Local
cls
echo ======================================================================
echo           DÉMARRAGE DU SERVEUR LOCAL - PAGLAAFI BURKINA FASO
echo ======================================================================
echo.
echo [1/2] Lancement du serveur en direct...
echo.
echo URL sur votre ordinateur : http://localhost:5173/
echo URL pour vos collègues (Wi-Fi) : http://192.168.1.88:5173/
echo.
echo ======================================================================
echo   Appuyez sur Ctrl+C pour arrêter le serveur à tout moment.
echo ======================================================================
echo.

pnpm run dev
pause
