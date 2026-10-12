<script setup>
defineProps({ content: { type: Array, required: true } })
</script>

<template>
  <template v-for="(part, index) in content" :key="index">
    <a v-if="part.type === 'link'" :href="part.href"><strong v-if="part.bold">{{ part.text }}</strong><template v-else>{{ part.text }}</template></a>
    <strong v-else-if="part.type === 'strong'">{{ part.text }}</strong>
    <code v-else-if="part.type === 'code'">{{ part.text }}</code>
    <br v-else-if="part.type === 'break'" />
    <template v-else>{{ part.text }}</template>
  </template>
</template>
