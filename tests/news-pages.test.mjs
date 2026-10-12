import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { parseNewsYaml } from '../scripts/news-data.mjs'

const news = parseNewsYaml(await readFile(new URL('../src/data/news.yaml', import.meta.url), 'utf8'))

function newsEntries(html) {
  const list = html.match(/<ul class="news-list">([\s\S]*?)<\/ul>/)
  assert.ok(list, 'Missing news list')
  return [...list[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, entry]) => ({
    date: entry.match(/<time\b[^>]*datetime="([^"]+)"/)[1],
    text: entry.replace(/<[^>]*>/g, ''),
  }))
}

test('homepage shows the latest eight news and the archive contains every entry', async () => {
  const [home, full] = await Promise.all([
    readFile(new URL('../docs/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../docs/full-news.html', import.meta.url), 'utf8'),
  ])
  const expected = [...news].sort((left, right) => right.date.localeCompare(left.date)).map(item => ({
    date: item.date,
    text: `[${item.date}] ${item.content.map(token => token.text).join('')}`,
  }))
  assert.deepEqual(newsEntries(home), expected.slice(0, 8))
  assert.deepEqual(newsEntries(full), expected)
  assert.match(home, /href="full-news\.html"/)
  assert.match(full, /data-page="full-news"/)
  assert.match(full, /<title>Full News — Ligeng Zhu<\/title>/)
  assert.match(full, /href="index\.html#news"/)
  assert.match(full, /href="index\.html#about"/)

  for (const item of news) {
    assert.match(item.date, /^\d{4}-(0[1-9]|1[0-2])$/)
    for (const token of item.content) {
      if (token.type === 'link') assert.ok(full.includes(`href="${token.href.replaceAll('&', '&amp;')}"`), token.href)
    }
  }
  const assets = [...full.matchAll(/(?:src|href)="(\.\/_app\/[^\"]+)"/g)].map(match => match[1])
  assert.ok(assets.some(path => path.endsWith('.js')))
  assert.ok(assets.some(path => path.endsWith('.css')))
  for (const path of assets) await access(new URL(`../docs/${path}`, import.meta.url))
})
