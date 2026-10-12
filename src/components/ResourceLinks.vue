<script setup>
defineProps({
  links: { type: Array, required: true },
  context: { type: String, default: '' },
})
</script>

<template>
  <ul class="resource-links">
    <li v-for="link in links" :key="`${link.label}-${link.href}`">
      <a :href="link.href" :aria-label="context ? `${link.label} for ${context}` : undefined">
        {{ link.label }}
      </a>
    </li>
  </ul>
</template>
