#!/bin/sh

# Lancer le compilateur TypeScript en mode watch
npx tsc -w &

# Lancer le serveur Vite
npm run dev &

# Attendre que les deux s'exécutent
wait
