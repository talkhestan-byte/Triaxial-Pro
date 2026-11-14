
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  root: rootDir,
  base: './',
  build: {
    outDir: '../www',
    emptyOutDir: true
  }
});
