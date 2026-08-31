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
        <div class="day-title-copy">
          <p class="day-kicker">{{ day.date }}</p>
          <h2>{{ day.title }}</h2>
        </div>
      </div>
      <span class="day-count">{{ day.items.length }} 站</span>
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
      <div class="day-image-scrim" aria-hidden="true"></div>
    </div>

    <div class="journey-list">
      <article
        v-for="(item, index) in day.items"
        :key="`${day.id}-${index}`"
        class="journey-item"
      >
        <div class="journey-rail" aria-hidden="true">
          <span class="journey-dot"></span>
        </div>

        <div class="journey-content">
          <div class="journey-meta">
            <time class="journey-time">{{ item.time }}</time>
            <span class="journey-stop">STOP {{ String(index + 1).padStart(2, '0') }}</span>
          </div>

          <h3>{{ item.title }}</h3>
          <p v-if="item.desc">{{ item.desc }}</p>
          <TransportCard v-if="item.transport" :transport="item.transport" />
          <ActionButtons :actions="item.actions || []" />
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.day-title-copy {
  min-width: 0;
}

.day-count {
  padding: 6px 9px;
  font-size: 9px;
  letter-spacing: .01em;
}

.day-image-wrap {
  isolation: isolate;
}

.day-image-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(7, 19, 37, 0) 68%, rgba(7, 19, 37, .16));
}

/*
 * Timeline v3: the rail lives inside the Day card and participates in normal
 * document flow. Time is no longer a side column, so it cannot visually hang
 * beside the content or collide with long transport cards on narrow screens.
 */
.journey-list {
  position: relative;
  padding: 4px 0 7px;
}

.journey-item {
  position: relative;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 11px;
  padding: 0 16px;
}

.journey-rail {
  position: relative;
  min-width: 0;
}

.journey-dot {
  position: absolute;
  z-index: 2;
  top: 21px;
  left: 50%;
  width: 10px;
  height: 10px;
  transform: translateX(-50%);
  border: 3px solid #fff;
  border-radius: 999px;
  background: #69a9f9;
  box-shadow: 0 0 0 1px #bfdcff;
}

.journey-item:not(:last-child) .journey-rail::after {
  content: '';
  position: absolute;
  z-index: 1;
  top: 32px;
  bottom: -12px;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, #d4e6fb, #e5ebf2);
}

.journey-content {
  min-width: 0;
  padding: 15px 0 17px;
  border-top: 1px solid #eff0f2;
}

.journey-item:first-child .journey-content {
  border-top: 0;
}

.journey-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  min-width: 0;
  margin-bottom: 7px;
}

.journey-time {
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  max-width: 100%;
  padding: 4px 8px;
  border: 1px solid #dbeafd;
  border-radius: 8px;
  background: #eef6ff;
  color: #0a6df0;
  font-size: 10px;
  line-height: 1.25;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.journey-stop {
  color: #a1a4aa;
  font-size: 8px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: .1em;
}

.journey-content h3 {
  margin: 0;
  font-size: 15px;
  line-height: 1.35;
  letter-spacing: -.018em;
}

.journey-content > p {
  margin: 5px 0 0;
  color: #68686e;
  font-size: 12px;
  line-height: 1.58;
}

:deep(.transport-card) {
  margin-top: 11px;
  padding: 12px;
  border-color: #e9eef5;
  border-radius: 14px;
  background: #f7f9fc;
}

:deep(.transport-top) {
  gap: 10px;
}

:deep(.fare-pill) {
  border-color: #dce9f8;
  background: #fff;
}

:deep(.actions) {
  gap: 7px;
  margin-top: 11px;
}

:deep(.action) {
  min-height: 38px;
  padding: 8px 11px;
  border-radius: 11px;
  touch-action: manipulation;
}

@media (min-width: 680px) {
  .journey-item {
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 13px;
    padding: 0 20px;
  }

  .journey-content {
    padding-top: 17px;
    padding-bottom: 19px;
  }

  .journey-dot {
    top: 23px;
  }

  .journey-item:not(:last-child) .journey-rail::after {
    top: 34px;
    bottom: -13px;
  }
}

@media (max-width: 420px) {
  .day-count {
    display: none;
  }

  .journey-item {
    grid-template-columns: 16px minmax(0, 1fr);
    gap: 9px;
    padding: 0 13px;
  }

  .journey-content {
    padding-top: 14px;
    padding-bottom: 16px;
  }

  .journey-dot {
    top: 20px;
    width: 9px;
    height: 9px;
  }

  .journey-item:not(:last-child) .journey-rail::after {
    top: 31px;
    bottom: -10px;
  }

  .journey-meta {
    margin-bottom: 6px;
  }

  .journey-content h3 {
    font-size: 14px;
  }

  :deep(.transport-card) {
    padding: 11px;
    margin-top: 10px;
  }

  :deep(.action) {
    min-height: 40px;
    flex: 1 1 auto;
  }

  :deep(.action-primary) {
    flex-basis: 100%;
  }
}
</style>
