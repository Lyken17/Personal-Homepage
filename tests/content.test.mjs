import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import site from '../src/data/site.json' with { type: 'json' }
import { parsePublicationsYaml } from '../scripts/publications-data.mjs'

const publications = parsePublicationsYaml(await readFile(new URL('../src/data/publications.yaml', import.meta.url), 'utf8'))

function* collectLinks(value) {
  if (Array.isArray(value)) {
    for (const child of value) yield* collectLinks(child)
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'href') yield child
      else yield* collectLinks(child)
    }
  }
}

test('publications follow the authorship rule or explicitly requested exceptions and have unique records', () => {
  // A specifically requested paper can override the general authorship filter.
  const requestedExceptions = new Set(['https://arxiv.org/abs/2610.13897'])
  const titles = new Set()
  const ids = new Set()
  for (const publication of publications) {
    const position = publication.authors.findIndex(author => author.replaceAll('*', '') === 'Ligeng Zhu') + 1
    const total = publication.authors.length
    const requestedException = requestedExceptions.has(publication.href)
      && typeof publication.authorshipException === 'string'
      && publication.authorshipException.trim().length > 0
    assert.ok([1, 2, total - 1, total].includes(position) || requestedException, publication.title)
    if (publication.authorshipException) assert.ok(requestedExceptions.has(publication.href), publication.title)
    assert.ok(!titles.has(publication.title.toLowerCase()), `Duplicate title: ${publication.title}`)
    assert.ok(!ids.has(publication.id), `Duplicate id: ${publication.id}`)
    assert.ok(publication.title && publication.venue && publication.links.length)
    titles.add(publication.title.toLowerCase())
    ids.add(publication.id)
  }
})

test('content links use valid destinations and local downloads exist', async () => {
  for (const href of new Set(collectLinks({ site, publications }))) {
    const url = new URL(href, 'https://lzhu.me/')
    assert.ok(['https:', 'http:', 'mailto:'].includes(url.protocol), href)
    if (href.startsWith('assets/')) {
      await access(new URL(`../docs/${decodeURIComponent(href)}`, import.meta.url))
    }
  }
})
