import { parse } from 'yaml'

export function parseNewsYaml(source) {
  const news = parse(source)
  if (!Array.isArray(news)) throw new Error('news.yaml must contain a list of news entries.')

  return news.map((item, index) => {
    const fail = message => { throw new Error(`news.yaml, entry ${index + 1}: ${message}`) }
    if (!item || typeof item !== 'object' || Array.isArray(item)) fail('expected a news record.')
    if (typeof item.date !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(item.date)) {
      fail('date must use YYYY-MM with a valid month.')
    }
    if (!Array.isArray(item.content) || !item.content.length) fail('content must be a nonempty list of rich-text tokens.')
    for (const token of item.content) {
      if (!token || !['text', 'strong', 'link', 'code', 'break'].includes(token.type)) fail('content contains an unsupported token type.')
      if (token.type !== 'break' && (typeof token.text !== 'string' || !token.text.length)) fail('text, strong, link, and code tokens require text.')
      if (token.type === 'link' && (typeof token.href !== 'string' || !token.href.trim())) fail('link tokens require href.')
      if (token.bold != null && typeof token.bold !== 'boolean') fail('bold must be a boolean.')
    }
    for (const field of ['dateBasis', 'dateSource']) {
      if (item[field] != null && (typeof item[field] !== 'string' || !item[field].trim())) fail(`${field} must be a nonempty string.`)
    }
    return item
  })
}
