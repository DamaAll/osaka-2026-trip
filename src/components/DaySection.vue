<script setup>
import ActionButtons from './ActionButtons.vue'
import TransportCard from './TransportCard.vue'

defineProps({ day: { type: Object, required: true } })
</script>

<template>
  <section :id="day.id" class="day-section section-anchor">
    <header class="day-heading">
      <div class="day-heading-copy">
        <span class="day-number">{{ day.no.replace('DAY ', 'D') }}</span>
        <div><p class="day-kicker">{{ day.date }}</p><h2>{{ day.title }}</h2></div>
      </div>
      <span class="day-count">{{ day.items.length }} stops</span>
    </header>

    <div class="day-image-wrap">
      <img
        class="day-image"
        :src="day.image"
        :alt="day.alt"
        loading="lazy"
        referrerpolicy="no-referrer"
        @error="$event.currentTarget.closest('.day-image-wrap').classList.add('image-failed')"
      />
      <div class="day-image-overlay"><span>{{ day.alt }}</span></div>
    </div>

    <div class="timeline">
      <article v-for="(item, index) in day.items" :key="`${day.id}-${index}`" class="timeline-item">
        <div class="timeline-side">
          <div class="timeline-time">{{ item.time }}</div>
          <span class="timeline-dot"></span>
        </div>
        <div class="timeline-content">
          <h3>{{ item.title }}</h3>
          <p v-if="item.desc">{{ item.desc }}</p>
          <TransportCard v-if="item.transport" :transport="item.transport" />
          <ActionButtons :actions="item.actions || []" />
        </div>
      </article>
    </div>
  </section>
</template>
