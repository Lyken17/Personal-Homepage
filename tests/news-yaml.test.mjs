import test from 'node:test'
import assert from 'node:assert/strict'
import { parseNewsYaml } from '../scripts/news-data.mjs'

const entry = `
- date: 2026-10
  content:
    - type: text
      text: "A news update: "
    - type: strong
      text: "#1"
    - type: link
      text: Details
      href: https://example.com/news
      bold: true
`

test('news YAML preserves rich text and editorial order for entries in the same month', () => {
  const news = parseNewsYaml(entry + entry.replace('Details', 'Second update'))
  assert.equal(news[0].date, '2026-10')
  assert.deepEqual(news[0].content, [
    { type: 'text', text: 'A news update: ' },
    { type: 'strong', text: '#1' },
    { type: 'link', text: 'Details', href: 'https://example.com/news', bold: true },
  ])
  assert.equal(news[1].content[2].text, 'Second update')
})

test('malformed news YAML fails before rendering invalid dates or broken links', () => {
  assert.throws(() => parseNewsYaml('date: 2026-10'), /must contain a list/)
  assert.throws(() => parseNewsYaml(entry.replace('2026-10', '2026-13')), /date must use YYYY-MM/)
  assert.throws(() => parseNewsYaml('- date: 2026-10\n  content: []'), /content must be a nonempty list/)
  assert.throws(() => parseNewsYaml(entry.replace('type: link', 'type: lin')), /unsupported token type/)
  assert.throws(() => parseNewsYaml(entry.replace('      href: https://example.com/news\n', '')), /link tokens require href/)
  assert.throws(() => parseNewsYaml(entry.replace('bold: true', 'bold: "true"')), /bold must be a boolean/)
})
