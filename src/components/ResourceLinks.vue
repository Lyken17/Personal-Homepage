<script setup>
defineProps({
  links: { type: Array, required: true },
  context: { type: String, default: '' },
  separated: { type: Boolean, default: false },
})
</script>

<template>
  <ul class="resource-links" :class="{ 'is-separated': separated }">
    <li v-for="(link, index) in links" :key="`${link.label}-${link.href}`">
      <span v-if="separated && index" class="resource-separator" aria-hidden="true">/</span>
      <a :href="link.href" :aria-label="context ? `${link.label} for ${context}` : undefined">
        {{ link.label }}
      </a>
    </li>
  </ul>
</template>
