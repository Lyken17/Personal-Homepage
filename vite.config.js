import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { parsePublicationsYaml } from './scripts/publications-data.mjs'

const publicationsPath = normalizePath(fileURLToPath(new URL('./src/data/publications.yaml', import.meta.url)))

export default defineConfig(({ isSsrBuild }) => ({
  base: './',
  publicDir: 'site-static',
  plugins: [
    {
      name: 'homepage-publications-yaml',
      enforce: 'pre',
      transform(source, id) {
        if (id.split('?')[0] !== publicationsPath) return
        const publications = parsePublicationsYaml(source)
        return { code: `export default ${JSON.stringify(publications)}`, map: null }
      },
    },
    vue(),
    {
      name: 'homepage-static-media',
      configureServer(server) {
        // Keep the existing, large PDF/slide library in one place. Production
        // serves it from docs/assets; development resolves the same URLs here.
        server.middlewares.use((request, _response, next) => {
          if (request.url?.startsWith('/assets/')) {
            request.url = `/docs${request.url}`
          }
          next()
        })
      },
    },
  ],
  build: {
    outDir: 'docs',
    assetsDir: '_app',
    emptyOutDir: false,
    rolldownOptions: {
      input: isSsrBuild
        ? fileURLToPath(new URL('./src/entry-server.js', import.meta.url))
        : {
            home: fileURLToPath(new URL('./index.html', import.meta.url)),
            publications: fileURLToPath(new URL('./full-publications.html', import.meta.url)),
          },
    },
  },
}))
