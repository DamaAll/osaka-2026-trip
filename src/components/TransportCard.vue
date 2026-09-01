<script setup>
defineProps({ transport: { type: Object, required: true } })

const cleanHeading = (heading) => heading.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D＋\s]+/u, '')
</script>

<template>
  <div class="transport-card">
    <div class="transport-top">
      <strong>{{ cleanHeading(transport.head) }}</strong>
      <span v-if="transport.fare" class="fare-pill">{{ transport.fare }}</span>
    </div>
    <ol class="route-steps">
      <li v-for="(step, index) in transport.steps || []" :key="index">{{ step }}</li>
    </ol>
  </div>
</template>
