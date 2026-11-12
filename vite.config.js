import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PRELOAD_FONTS = [/geist-latin-wght-normal-.*\.woff2$/];

function preloadFonts() {
  return {
    name: 'preload-latin-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle || {}).filter((f) => PRELOAD_FONTS.some((re) => re.test(f)));
        return files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/${f}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head'
        }));
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts()],
  server: {
    port: 3000,
    open: false
  }
});
