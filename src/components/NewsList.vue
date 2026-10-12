<script setup>
import RichText from './RichText.vue'

defineProps({ news: { type: Array, required: true } })
</script>

<template>
  <ul class="news-list">
    <li v-for="(item, index) in news" :key="index">
      <time class="news-date" :datetime="item.date">[{{ item.date }}]</time>{{ ' ' }}<RichText :content="item.content" />
    </li>
  </ul>
</template>
