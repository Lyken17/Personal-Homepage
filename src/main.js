import { createApp, createSSRApp } from 'vue'
import pages from './pages.js'
import './styles.css'

const container = document.getElementById('app')
const create = container.hasChildNodes() ? createSSRApp : createApp
const Page = pages[container.dataset.page] ?? pages.home
create(Page).mount(container)
