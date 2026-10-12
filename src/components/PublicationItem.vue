<script setup>
import ResourceLinks from './ResourceLinks.vue'

defineProps({ publication: { type: Object, required: true } })
</script>

<template>
  <div :id="publication.id" class="publication" role="article" :aria-labelledby="`${publication.id}-title`">
    <h3 :id="`${publication.id}-title`"><a :href="publication.href">{{ publication.title }}</a></h3>
    <p class="authors">
      <template v-for="(author, index) in publication.authors" :key="`${author}-${index}`">
        <template v-if="index">, </template>
        <strong v-if="author.startsWith('Ligeng Zhu')">{{ author }}</strong>
        <template v-else>{{ author }}</template>
      </template>
    </p>
    <p v-for="note in publication.notes" :key="note" class="publication-note">{{ note }}</p>
    <p class="venue"><em>{{ publication.venue }}</em><template v-if="publication.year">, {{ publication.year }}</template></p>
    <p v-if="publication.earlierTitle" class="publication-note">Earlier title: {{ publication.earlierTitle }}.</p>
    <ResourceLinks :links="publication.links" :context="publication.title" separated />
    <div v-if="publication.media.length" class="media-coverage">
      <span>Media coverage:</span>
      <ResourceLinks :links="publication.media" :context="publication.title" separated />
    </div>
  </div>
</template>
