import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite-plus';

export default defineConfig({
  // Relative asset URLs so the demo works from the GitHub Pages sub-path.
  base: './',
  resolve: {
    alias: {
      // Resolve the package to its source so the demo reflects edits without rebuilding `dist`.
      'react-player': fileURLToPath(new URL('../../src/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL('../../demo', import.meta.url)),
    emptyOutDir: true,
    target: 'es2020',
    // Playback engines (dash.js, Wistia, ...) are large but lazy-loaded per source.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      onLog(level, log, defaultHandler) {
        // `'use client'` in dependencies is irrelevant to a client-only bundle.
        if (log.code === 'MODULE_LEVEL_DIRECTIVE') return;
        defaultHandler(level, log);
      },
    },
  },
});
