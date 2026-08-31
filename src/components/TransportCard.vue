<script setup>
defineProps({ transport: { type: Object, required: true } })
</script>

<template>
  <div class="transport-card">
    <div class="transport-top">
      <strong>{{ transport.head }}</strong>
      <span v-if="transport.fare" class="fare-pill">{{ transport.fare }}</span>
    </div>
    <ol class="route-steps">
      <li v-for="(step, index) in transport.steps || []" :key="index">{{ step }}</li>
    </ol>
  </div>
</template>
