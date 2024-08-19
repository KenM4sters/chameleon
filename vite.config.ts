import { defineConfig } from 'vite';

export default defineConfig({
  base: '/chameleon', // Add this line to set the base path for your project
  build: {
    outDir: 'dist', // Default is 'dist', you can change if needed
  },
});