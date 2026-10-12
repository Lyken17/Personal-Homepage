import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePublicationsYaml } from '../scripts/publications-data.mjs'

const paper = `
- id: example-paper
  tag: [agents, selected]
  title: "An example: YAML publication"
  href: https://example.com/paper
  authors: [Ligeng Zhu]
  venue: arXiv preprint
  year: 2026
`

test('a minimal YAML record keeps multiple tags and supplies optional rendering fields', () => {
  const [publication] = parsePublicationsYaml(paper)
  assert.deepEqual(publication.tag, ['agents', 'selected'])
  assert.equal(publication.title, 'An example: YAML publication')
  assert.deepEqual(publication.notes, [])
  assert.deepEqual(publication.media, [])
  assert.deepEqual(publication.links, [{ label: 'Paper', href: 'https://example.com/paper' }])
})

test('invalid tags and duplicate IDs fail before generating ambiguous pages', () => {
  assert.throws(() => parsePublicationsYaml(paper.replace('[agents, selected]', 'selected')), /tag must be a list/)
  assert.throws(() => parsePublicationsYaml(paper.replace('  tag: [agents, selected]\n', '')), /tag must be a list/)
  assert.throws(() => parsePublicationsYaml(paper + paper), /duplicate id/)
})
