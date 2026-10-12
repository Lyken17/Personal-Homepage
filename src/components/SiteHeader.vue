<script setup>
import { ref } from 'vue'

defineProps({ homeHref: { type: String, default: '' } })

const menuOpen = ref(false)
const menuButton = ref(null)
const sections = [
  { id: 'about', label: 'About' },
  { id: 'news', label: 'News' },
  { id: 'publications', label: 'Publications' },
  { id: 'collaborators', label: 'Collaborators' },
  { id: 'talks', label: 'Talks' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
]

function dismissMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  menuButton.value?.focus()
}
</script>

<template>
  <header class="site-header" @keydown.esc="dismissMenu">
    <nav class="container header-inner" aria-label="Main navigation">
      <a class="wordmark" :href="`${homeHref}#about`" @click="menuOpen = false">Ad Mare Astrorum</a>
      <button
        ref="menuButton"
        class="menu-toggle"
        type="button"
        aria-controls="section-navigation"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? 'Close' : 'Menu' }}
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path v-if="menuOpen" d="m4 4 10 10M14 4 4 14" />
          <path v-else d="M3 5h12M3 9h12M3 13h12" />
        </svg>
      </button>
      <ul id="section-navigation" class="section-navigation" :class="{ 'is-open': menuOpen }">
        <li v-for="section in sections" :key="section.id">
          <a :href="`${homeHref}#${section.id}`" @click="menuOpen = false">{{ section.label }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
