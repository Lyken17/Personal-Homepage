# Ligeng Zhu's homepage

A responsive academic homepage built with Vue 3 and Vite. It includes publications, news, collaborators, talks, open-source projects, and reviewing services.

## Local development

Use Node.js 22 (22.18+) or 24.12+.

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:1313/>. Vite updates the page as you edit the source.

## Content and components

- `src/data/site.json` contains the profile, news, collaborators, talks, projects, services, and footer credits. Update the profile's `updated` date when changing content.
- `src/data/publications.yaml` is the single source for all publications. Both Vue pages import it; Vite parses it before rendering their HTML. Editing it updates the development preview automatically, and `npm run build` reads it to generate both static pages.
- `src/App.vue` lays out the sections.
- `src/FullPublications.vue` renders the separate full publication list at `full-publications.html`.
- `src/components/` contains the navigation, publication, project, and link components.
- `src/styles.css` contains the responsive layout and typography.
- `docs/assets/` holds the existing PDFs, slides, posters, and other downloads. Development serves these files at the same `/assets/` URLs as production.
- `site-static/` contains the favicon, the `CNAME` file for `lzhu.me`, and `.nojekyll` so GitHub Pages serves the generated `_app/` bundles.

By default, include papers where Ligeng Zhu is the first, second, penultimate, or last author. For a specifically requested exception, record the reason in the paper's `authorshipException` field and add its URL to the allowlist in `tests/content.test.mjs`. Consolidate preprint and published versions of the same work into one entry.

Every publication has a `tag` list. The homepage shows papers whose list contains `selected`, in YAML order. Use `tag: [selected]` to include a paper on the homepage, `tag: []` to keep it on Full Publications only, or a list such as `tag: [selected, agents]` for multiple tags. The full page renders every YAML entry, regardless of tags. Links to older, unselected publication anchors on the homepage forward to the full page.

```yaml
- id: example-paper
  tag: [selected]
  title: "Example paper title"
  href: https://arxiv.org/abs/example-paper
  authors:
    - Ligeng Zhu
  venue: arXiv preprint
  year: 2026
  links:
    - label: Paper
      href: https://arxiv.org/abs/example-paper
    - label: Code
      href: https://github.com/owner/repository
```

`notes` and `media` are optional lists. If `links` is omitted, the Paper link defaults to `href`. The YAML loader reports malformed records, missing tags, and duplicate IDs before generating the site. Selection tests follow the YAML tags, so changing the selected list does not require editing Vue code or a hardcoded list in the tests.

News entries contain a `date` in `YYYY-MM` format and a `content` array of rich-text tokens, ordered newest first. Record the source or basis in `dateBasis` and optionally `dateSource`. Use the known event or announcement month; if unavailable, use the original website posting month and identify that basis explicitly.

Each project has a saved `stars` count (verified on October 12, 2026), rendered immediately with the page. Counts refresh from GitHub's public repository API in the browser and are cached locally for six hours. If GitHub is unavailable or rate limited, the saved count remains visible. The saved value can use GitHub's abbreviated display, such as `3.9k`.

## Verify and build

```sh
npm run build
npm test
```

The build writes the deployable site to `docs/`, using `_app/` for generated JavaScript and CSS. It cleans only that generated directory, preserving `docs/assets/` and all downloads. Relative bundle paths support both a custom domain and a GitHub Pages project path.

Production pre-renders both `docs/index.html` and `docs/full-publications.html`, so their content and links remain readable before JavaScript loads. Vue hydrates that HTML to enable the mobile navigation. No application server is required in production. The page tests check the generated HTML, so build before running tests.

To inspect the production build locally, stop any server on port 1313 and run:

```sh
npm run preview
```

GitHub Pages publishes `docs/` from the `master` branch at `https://lzhu.me/`. Run the build and tests, commit the source together with the generated `docs/` files, then push to `master` to deploy. Keep `docs/CNAME` and `docs/.nojekyll` in each build. Netlify runs `npm ci && npm run build` and publishes `docs/` using the included configuration.

The previous Hugo build is archived in `public-bak/`; the original Hugo content and theme remain available in this repository.
