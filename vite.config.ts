import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function socialMetaOriginPlugin(): Plugin {
  return {
    name: 'social-meta-origin',
    transformIndexHtml(html) {
      const appUrl = (process.env.APP_URL || '').trim().replace(/\/$/, '');
      if (!appUrl) return html;
      return html
        .replaceAll('content="/og-image.jpg"', `content="${appUrl}/og-image.jpg"`)
        .replace('"/og-image.jpg"', `"${appUrl}/og-image.jpg"`)
        .replace(
          '<meta property="og:type" content="website" />',
          `<meta property="og:type" content="website" />\n    <meta property="og:url" content="${appUrl}/" />\n    <link rel="canonical" href="${appUrl}/" />`
        );
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), socialMetaOriginPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
