import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function servePwaStaticAssetsPlugin(): Plugin {
  return {
    name: 'serve-pwa-static-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = req.url?.split('?')[0];
        if (cleanUrl === '/manifest.json' || cleanUrl === '/manifest.webmanifest') {
          try {
            const manifestPath = path.resolve(__dirname, 'public/manifest.json');
            const content = fs.readFileSync(manifestPath, 'utf-8');
            res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(content);
            return;
          } catch (err) {
            console.error('Error serving manifest:', err);
          }
        }
        if (cleanUrl === '/sw.js') {
          try {
            const swPath = path.resolve(__dirname, 'public/sw.js');
            const content = fs.readFileSync(swPath, 'utf-8');
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Service-Worker-Allowed', '/');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(content);
            return;
          } catch (err) {
            console.error('Error serving sw.js:', err);
          }
        }
        if (cleanUrl === '/takahishab-android-app.apk') {
          try {
            const apkPath = path.resolve(__dirname, 'public/takahishab-android-app.apk');
            if (fs.existsSync(apkPath)) {
              const fileBuffer = fs.readFileSync(apkPath);
              res.setHeader('Content-Type', 'application/vnd.android.package-archive');
              res.setHeader('Content-Disposition', 'attachment; filename="takahishab-android-app.apk"');
              res.setHeader('Content-Length', fileBuffer.length.toString());
              res.statusCode = 200;
              res.end(fileBuffer);
              return;
            }
          } catch (err) {
            console.error('Error serving takahishab-android-app.apk:', err);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      servePwaStaticAssetsPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'টাকা হিসাব - দৈনিক খরচ ও মাসিক বাজেট',
          short_name: 'টাকা হিসাব',
          description: 'প্রতিদিনের খরচের হিসাব, বাসা থেকে পাওয়া টাকা ও মাসিক বাজেট নিয়ন্ত্রণের অ্যাপ্লিকেশন।',
          theme_color: '#059669',
          background_color: '#f8fafc',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
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
