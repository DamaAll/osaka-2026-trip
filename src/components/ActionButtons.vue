<script setup>
defineProps({ actions: { type: Array, default: () => [] } })

const classFor = (type) => {
  if (type === 'route') return 'action action-primary'
  if (type === 'map') return 'action action-map'
  return 'action'
}

const cleanLabel = (label) => label.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D↗＋\s]+/u, '')
</script>

<template>
  <div v-if="actions.length" class="actions">
    <a
      v-for="([label, url, type], index) in actions"
      :key="`${label}-${index}`"
      :class="classFor(type)"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
    >{{ cleanLabel(label) }}</a>
  </div>
</template>
