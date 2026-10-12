<script setup>
import SiteHeader from './components/SiteHeader.vue'
import RichText from './components/RichText.vue'
import NewsList from './components/NewsList.vue'
import site from './data/site.json'
import news from './data/news.js'
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <SiteHeader home-href="index.html" />

  <main id="main-content" class="container news-page" tabindex="-1" aria-labelledby="full-news-title">
    <header class="news-page-header">
      <h1 id="full-news-title">Full News</h1>
      <p><a href="index.html#news">Back to latest news</a></p>
    </header>
    <NewsList :news="news" />
  </main>

  <footer class="container site-footer">
    <p><RichText :content="site.footer" /></p>
    <a class="back-to-top" href="#main-content">Back to top ↑</a>
  </footer>
</template>
