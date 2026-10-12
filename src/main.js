import { createApp, createSSRApp } from 'vue'
import App from './App.vue'
import FullPublications from './FullPublications.vue'
import './styles.css'

const container = document.getElementById('app')
const create = container.hasChildNodes() ? createSSRApp : createApp
const Page = container.dataset.page === 'full-publications' ? FullPublications : App
create(Page).mount(container)
