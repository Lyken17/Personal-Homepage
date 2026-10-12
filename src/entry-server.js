import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import pages from './pages.js'

export function render(page = 'home') {
  const Page = pages[page] ?? pages.home
  return renderToString(createSSRApp(Page))
}
