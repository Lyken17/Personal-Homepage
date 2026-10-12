<script setup>
defineProps({ content: { type: Array, required: true } })
</script>

<template>
  <template v-for="(part, index) in content" :key="index">
    <a v-if="part.type === 'link'" :href="part.href">{{ part.text }}</a>
    <code v-else-if="part.type === 'code'">{{ part.text }}</code>
    <br v-else-if="part.type === 'break'" />
    <template v-else>{{ part.text }}</template>
  </template>
</template>
