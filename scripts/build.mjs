import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

// Clean generated bundles only. docs/assets contains the original downloads,
// and must survive every build, along with the custom domain and favicon.
await rm(fileURLToPath(new URL('../docs/_app', import.meta.url)), {
  recursive: true,
  force: true,
})
await build()

// Render the same Vue components once at build time. The result works on
// static hosting and is readable without JavaScript; the client hydrates it.
const serverDirectory = new URL('../node_modules/.vite/homepage-ssr/', import.meta.url)
try {
  await build({
    build: {
      ssr: 'src/entry-server.js',
      outDir: fileURLToPath(serverDirectory),
      emptyOutDir: true,
      copyPublicDir: false,
    },
  })
  const { render } = await import(new URL('entry-server.js', serverDirectory).href)
  for (const [filename, pageName] of [
    ['index.html', 'home'],
    ['full-publications.html', 'full-publications'],
    ['full-news.html', 'full-news'],
  ]) {
    const markup = await render(pageName)
    const pagePath = new URL(`../docs/${filename}`, import.meta.url)
    const page = await readFile(pagePath, 'utf8')
    const mount = `<div id="app" data-page="${pageName}"></div>`
    if (!page.includes(mount)) {
      throw new Error(`${filename} is missing its Vue mount element.`)
    }
    await writeFile(pagePath, page.replace(mount, () => `<div id="app" data-page="${pageName}">${markup}</div>`))
    console.log(`Pre-rendered ${filename} to docs/${filename}.`)
  }
} finally {
  await rm(serverDirectory, { recursive: true, force: true })
}
