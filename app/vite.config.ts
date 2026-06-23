import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relative ('./') -> l'app fonctionne quel que soit le sous-chemin
// d'hébergement (GitHub Pages racine ou sous-dossier /lumeria/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500, // Phaser est volumineux : seuil relevé
  },
});
