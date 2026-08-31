<script setup>
defineProps({ actions: { type: Array, default: () => [] } })

const classFor = (type) => {
  if (type === 'route') return 'action action-primary'
  if (type === 'map') return 'action action-map'
  return 'action'
}
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
    >{{ label }}</a>
  </div>
</template>
