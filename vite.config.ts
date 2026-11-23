import path from 'node:path';
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { githubSponsors } from './plugins/githubSponsors.ts';
import { sponsorsConfig } from './src/config/site.ts';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    githubSponsors(sponsorsConfig.account),
  ],
  resolve: {
    alias: {
      '@': path.join(rootDir, 'src'),
    },
  },
});
