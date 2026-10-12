import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'
import FullPublications from './FullPublications.vue'

export function render(page = 'home') {
  const Page = page === 'full-publications' ? FullPublications : App
  return renderToString(createSSRApp(Page))
}
