@echo off
echo ========================================
echo    EUGENE STORE - Démarrage
echo ========================================
echo.

echo Installation des dependances...
npm install

echo.
echo Demarrage des serveurs...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.

npm run dev:full

pause 