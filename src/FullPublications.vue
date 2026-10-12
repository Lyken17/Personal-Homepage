<script setup>
import { onMounted, nextTick } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import RichText from './components/RichText.vue'
import PublicationItem from './components/PublicationItem.vue'
import site from './data/site.json'
import publications from './data/publications.yaml'

onMounted(async () => {
  await nextTick()
  if (window.location.hash) {
    document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
  }
})
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <SiteHeader home-href="index.html" />

  <main id="main-content" class="container publication-page" tabindex="-1" aria-labelledby="full-publications-title">
    <header class="publication-page-header">
      <h1 id="full-publications-title">Full Publications</h1>
      <p><a href="index.html#publications">Back to selected publications</a></p>
    </header>
    <div class="publication-list">
      <PublicationItem v-for="publication in publications" :key="publication.id" :publication="publication" />
    </div>
  </main>

  <footer class="container site-footer">
    <p><RichText :content="site.footer" /></p>
    <a class="back-to-top" href="#main-content">Back to top ↑</a>
  </footer>
</template>
