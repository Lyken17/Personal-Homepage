import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { parsePublicationsYaml } from '../scripts/publications-data.mjs'

const publications = parsePublicationsYaml(await readFile(new URL('../src/data/publications.yaml', import.meta.url), 'utf8'))

function publicationIds(html) {
  return [...html.matchAll(/<div\b[^>]*\bclass="publication"[^>]*>/g)]
    .map(([tag]) => tag.match(/\bid="([^"]+)"/)[1])
}

test('static pages render YAML publications and select the homepage list by tag', async () => {
  const [home, full] = await Promise.all([
    readFile(new URL('../docs/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../docs/full-publications.html', import.meta.url), 'utf8'),
  ])
  assert.deepEqual(publicationIds(home), publications.filter(publication => publication.tag.includes('selected')).map(publication => publication.id))
  assert.deepEqual(publicationIds(full), publications.map(publication => publication.id))
  assert.match(home, /data-page="home"/)
  assert.match(home, /href="full-publications\.html"/)
  assert.match(full, /data-page="full-publications"/)
  assert.match(full, /<title>Full Publications — Ligeng Zhu<\/title>/)
  assert.match(full, /href="index\.html#publications"/)
  assert.match(full, /href="index\.html#collaborators"/)
  assert.match(full, /href="index\.html#about"/)

  for (const html of [home, full]) {
    const assets = [...html.matchAll(/(?:src|href)="(\.\/_app\/[^\"]+)"/g)].map(match => match[1])
    assert.ok(assets.some(path => path.endsWith('.js')), 'Missing client bundle')
    assert.ok(assets.some(path => path.endsWith('.css')), 'Missing stylesheet')
    for (const path of assets) await access(new URL(`../docs/${path}`, import.meta.url))
  }

  await access(new URL('../docs/.nojekyll', import.meta.url))
  assert.equal((await readFile(new URL('../docs/CNAME', import.meta.url), 'utf8')).trim(), 'lzhu.me')
})
