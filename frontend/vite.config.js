import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import parenscriptPlugin from './vite-parenscript';
import analyze from "rollup-plugin-analyzer";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: false
  },
  plugins: [preact({prefreshEnabled: false}), parenscriptPlugin(), visualizer()],
  build: {
    rollupOptions: {
      plugins: [analyze()]
    }
  }
});
