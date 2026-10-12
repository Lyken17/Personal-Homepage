<script setup>
import { computed, onMounted, ref } from 'vue'
import RichText from './RichText.vue'

const props = defineProps({ project: { type: Object, required: true } })
const stars = ref(props.project.stars)
const starLabel = computed(() => typeof stars.value === 'number'
  ? new Intl.NumberFormat('en-US').format(stars.value)
  : stars.value)
const cacheLifetime = 6 * 60 * 60 * 1000

onMounted(async () => {
  const cacheKey = `homepage:github-stars:${props.project.repo}`
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey))
    if (Number.isSafeInteger(cached?.stars) && cached.stars >= 0 && cached.expires > Date.now()) {
      stars.value = cached.stars
      return
    }
  } catch { /* Storage may be unavailable; keep the pre-rendered count. */ }

  try {
    const response = await fetch(`https://api.github.com/repos/${props.project.repo}`, {
      credentials: 'omit',
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return
    const repository = await response.json()
    if (!Number.isSafeInteger(repository.stargazers_count) || repository.stargazers_count < 0) return
    stars.value = repository.stargazers_count
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ stars: stars.value, expires: Date.now() + cacheLifetime }))
    } catch { /* The count still works without persistent storage. */ }
  } catch { /* GitHub limits or network errors leave the saved count visible. */ }
})
</script>

<template>
  <article class="project-card">
    <h3><a :href="project.href">{{ project.name }}</a></h3>
    <p class="project-stars">
      Stars:
      <a :href="`${project.href}/stargazers`" :aria-label="`${starLabel} stars for ${project.repo} on GitHub`">
        <span class="star-count">{{ starLabel }}</span>
      </a>
    </p>
    <p class="project-description"><RichText :content="project.description" /></p>
  </article>
</template>
