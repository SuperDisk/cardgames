import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import parenscriptPlugin from './vite-parenscript';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: false
  },
  plugins: [preact({prefreshEnabled: false}), parenscriptPlugin()],
});
