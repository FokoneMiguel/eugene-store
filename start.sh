#!/bin/bash

echo "========================================"
echo "    EUGENE STORE - Démarrage"
echo "========================================"
echo

echo "Installation des dépendances..."
npm install

echo
echo "Démarrage des serveurs..."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo

npm run dev:full 