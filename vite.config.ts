import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname || '', 'index.html'),
          about: path.resolve(import.meta.dirname || '', 'about.html'),
          menu: path.resolve(import.meta.dirname || '', 'menu.html'),
          contact: path.resolve(import.meta.dirname || '', 'contact.html'),
        },
      },
    },
  };
});
