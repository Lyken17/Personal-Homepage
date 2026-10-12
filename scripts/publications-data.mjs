import { parse } from 'yaml'

export function parsePublicationsYaml(source) {
  const publications = parse(source)
  if (!Array.isArray(publications)) throw new Error('publications.yaml must contain a list of papers.')
  const ids = new Set()

  return publications.map((publication, index) => {
    const label = `publications.yaml, paper ${index + 1}`
    const fail = message => { throw new Error(`${label}: ${message}`) }
    const stringList = (value, field) => {
      if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item.trim())) {
        fail(`${field} must be a list of strings.`)
      }
      return value
    }
    const resourceList = (value, field) => {
      if (!Array.isArray(value) || value.some(link => !link || typeof link.label !== 'string'
        || !link.label.trim() || typeof link.href !== 'string' || !link.href.trim())) {
        fail(`${field} must be a list of links with label and href.`)
      }
      return value
    }

    if (!publication || typeof publication !== 'object' || Array.isArray(publication)) fail('expected a paper record.')
    for (const field of ['id', 'title', 'href', 'venue']) {
      if (typeof publication[field] !== 'string' || !publication[field].trim()) fail(`${field} is required.`)
    }
    if (!/^[\w-]+$/.test(publication.id)) fail('id may contain only letters, numbers, underscores, and hyphens.')
    if (ids.has(publication.id)) fail(`duplicate id "${publication.id}".`)
    ids.add(publication.id)
    if (Object.hasOwn(publication, 'selected')) fail('use tag: [selected] instead of a selected boolean.')
    stringList(publication.tag, 'tag')
    stringList(publication.authors, 'authors')
    if (!publication.authors.length) fail('authors must not be empty.')
    if (publication.year != null && !Number.isInteger(publication.year)) fail('year must be an integer.')

    return {
      ...publication,
      notes: stringList(publication.notes ?? [], 'notes'),
      links: resourceList(publication.links ?? [{ label: 'Paper', href: publication.href }], 'links'),
      media: resourceList(publication.media ?? [], 'media'),
    }
  })
}
