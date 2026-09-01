<script setup>
import ActionButtons from './ActionButtons.vue'
import TransportCard from './TransportCard.vue'

import { computed, ref } from 'vue'

const props = defineProps({
  day: { type: Object, required: true },
  note: { type: String, default: '' },
  isToday: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false },
  currentItem: { type: Number, default: -1 },
  nextItem: { type: Number, default: -1 }
})
defineEmits(['update:note'])

/*
 * 旅行中只展開今天，其他天收起來——五天全開是 18 個螢幕，
 * 而現場只關心今天。收起來的日子仍然點得開。
 */
const openedByUser = ref(false)
const isOpen = computed(() => !props.collapsed || openedByUser.value)

/*
 * 分類取代原本的 STOP 01。序號在現場沒有用處，「這一站是交通還是用餐」才有。
 * 現在／下一站會佔走同一個位置，所以一行最多兩個標籤。
 */
const TYPE_LABEL = {
  transport: '交通', attraction: '景點', food: '用餐', shopping: '購物',
  rest: '休息', decision: '決策', hotel: '住宿', flight: '航班'
}
const typeLabel = (type) => TYPE_LABEL[type] || ''
const stopState = (index) => {
  if (!props.isToday) return ''
  if (index === props.currentItem) return 'now'
  if (index === props.nextItem) return 'next'
  return index < props.currentItem ? 'done' : ''
}
</script>

<template>
  <section :id="day.id" class="day-section section-anchor" :class="{ 'is-today': isToday, 'is-collapsed': !isOpen }">
    <header class="day-heading">
      <div class="day-heading-copy">
        <span class="day-number">{{ day.no.replace('DAY ', 'D') }}</span>
        <div class="day-title-copy">
          <p class="day-kicker">{{ day.date }}<b v-if="isToday" class="today-tag">今天</b></p>
          <h2>{{ day.title }}</h2>
        </div>
      </div>
      <span class="day-count">{{ day.items.length }} 站</span>
    </header>

    <button v-if="!isOpen" type="button" class="day-expand" @click="openedByUser = true">
      展開這一天的 {{ day.items.length }} 站
    </button>

    <template v-if="isOpen">
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

    <details v-if="day.weatherPlan" class="rain-plan">
      <summary>
        <div><span>WEATHER SWITCH</span><h3>{{ day.weatherPlan.title }}</h3></div>
        <b>{{ day.weatherPlan.branches.map(branch => branch.tag).join(' / ') }}</b>
      </summary>
      <div class="rain-plan-body">
        <article v-for="branch in day.weatherPlan.branches" :key="branch.tag">
          <h4>{{ branch.tag }}</h4>
          <p><strong>啟用條件：</strong>{{ branch.trigger }}</p>
          <ol>
            <li v-for="step in branch.steps" :key="step">{{ step }}</li>
          </ol>
        </article>
        <a v-if="day.weatherPlan.url" :href="day.weatherPlan.url" target="_blank" rel="noopener noreferrer">官方建議</a>
      </div>
    </details>

    <div class="journey-list">
      <article
        v-for="(item, index) in day.items"
        :id="`${day.id}-stop-${index}`"
        :key="`${day.id}-${index}`"
        class="journey-item"
        :class="`stop-${stopState(index) || 'plain'}`"
      >
        <div class="journey-rail" aria-hidden="true">
          <span class="journey-dot"></span>
        </div>

        <div class="journey-content">
          <div class="journey-meta">
            <time class="journey-time">{{ item.time }}</time>
            <span v-if="stopState(index) === 'now'" class="stop-flag flag-now">現在</span>
            <span v-else-if="stopState(index) === 'next'" class="stop-flag flag-next">下一站</span>
            <span v-else-if="typeLabel(item.type)" class="journey-type">{{ typeLabel(item.type) }}</span>
            <span v-if="item.statusLabel" class="journey-status" :class="`status-${item.status}`">{{ item.statusLabel }}</span>
          </div>

          <h3>{{ item.title }}</h3>
          <p v-if="item.desc">{{ item.desc }}</p>
          <p v-if="item.note" class="journey-note">{{ item.note }}</p>
          <div v-if="item.choices" class="choice-list" aria-label="午餐候選">
            <a
              v-for="choice in item.choices"
              :key="choice.label"
              class="choice-row"
              :href="choice.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{{ choice.label }}</span>
              <span class="choice-copy"><strong>{{ choice.title }}</strong><small>{{ choice.desc }}</small></span>
              <b aria-hidden="true">MAP</b>
            </a>
          </div>
          <TransportCard v-if="item.transport" :transport="item.transport" />
          <ActionButtons :actions="item.actions || []" />
        </div>
      </article>
    </div>

    <details class="day-note" :open="!!note">
      <summary>
        <span>當天筆記</span>
        <b>{{ note.trim() ? '已寫' : '空白' }}</b>
      </summary>
      <textarea
        :value="note"
        maxlength="2000"
        rows="3"
        placeholder="吃到的店名、明天要補買的東西、想記得的事。只存在這支手機，會跟著備份檔一起匯出。"
        :aria-label="`${day.no} 當天筆記`"
        @input="$emit('update:note', $event.target.value)"
      ></textarea>
    </details>
    </template>
  </section>
</template>

<style scoped>
.day-title-copy {
  min-width: 0;
}

/*
 * 今天不需要外框。卡片有 3.4 個螢幕高，框線會沿著螢幕兩側延伸三個螢幕，
 * 那不是在標示今天，是噪音。其他天已經收合，今天是唯一展開的那張，
 * 標題的徽章補完最後一哩就夠。
 */
.today-tag {
  margin-left: 7px;
  padding: 2px 8px;
  border: 1px solid #bcd8fb;
  border-radius: 999px;
  background: #eef6ff;
  color: var(--blue-deep, #0054c7);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0;
}

.day-expand {
  width: calc(100% - 24px);
  min-height: 46px;
  margin: 0 12px 12px;
  border: 1px dashed #cfd6de;
  border-radius: 12px;
  background: #fafbfc;
  color: #5c6672;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.day-expand:active { background: #f2f4f7; }

/* 走過的站點淡出，現在與下一站拉出來。 */
.stop-done .journey-content { opacity: .5; }

.stop-now .journey-content {
  margin: 4px 0;
  padding: 15px 13px 17px;
  border: 0;
  border-radius: 14px;
  background: #eef6ff;
  box-shadow: inset 0 0 0 1px #cfe2fb;
}

.stop-now .journey-dot {
  background: var(--blue, #0a6df0);
  box-shadow: 0 0 0 4px rgba(10,109,240,.18);
}

.stop-flag {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 850;
}

.flag-now { background: var(--blue, #0a6df0); color: #fff; }
.flag-next { border: 1px solid #cfe2fb; background: #fff; color: #0a6df0; }

.day-count {
  padding: 6px 9px;
  font-size: 11px;
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

.rain-plan {
  margin: 10px 12px 5px;
  padding: 14px;
  border: 1px solid #bfe2d5;
  border-radius: 16px;
  background: #eff9f5;
}

.rain-plan > summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  cursor: pointer;
  list-style: none;
}

.rain-plan > summary::-webkit-details-marker { display: none; }

.rain-plan > summary span {
  display: block;
  color: #16835b;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .12em;
}

.rain-plan > summary h3 {
  margin: 3px 0 0;
  font-size: 16px;
}

.rain-plan > summary b {
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px solid #a9d7c7;
  border-radius: 999px;
  background: #fff;
  color: #116b4b;
  font-size: 11px;
  font-weight: 800;
}

.rain-plan[open] > summary b::after { content: ' ▴'; }
.rain-plan:not([open]) > summary b::after { content: ' ▾'; }

.rain-plan-body > article + article {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #cfe7dc;
}

.rain-plan-body h4 {
  margin: 14px 0 0;
  color: #116b4b;
  font-size: 12px;
  font-weight: 850;
}

.rain-plan-body > article + article h4 { margin-top: 0; }

.rain-plan p {
  margin: 8px 0 0;
  color: #3f6c5d;
  font-size: 13px;
  line-height: 1.5;
}

.rain-plan-body > a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  margin-top: 12px;
  padding: 0 12px;
  border: 1px solid #a9d7c7;
  border-radius: 10px;
  background: #fff;
  color: #116b4b;
  font-size: 11px;
  font-weight: 800;
}

.rain-plan ol {
  display: grid;
  gap: 6px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: rain-step;
}

.rain-plan li {
  counter-increment: rain-step;
  position: relative;
  padding-left: 24px;
  color: #315a4d;
  font-size: 13px;
  line-height: 1.5;
}

.rain-plan li::before {
  content: counter(rain-step);
  position: absolute;
  top: 0;
  left: 0;
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: #d5eee5;
  color: #116b4b;
  font-size: 11px;
  font-weight: 850;
}

/* 有寫過就預設展開，不用每天再點一次才看得到自己記的東西。 */
.day-note {
  margin: 0 12px 12px;
  border: 1px solid #e9eef5;
  border-radius: 14px;
  background: #f7f9fc;
}

.day-note > summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 44px;
  padding: 0 13px;
  cursor: pointer;
  list-style: none;
}

.day-note > summary::-webkit-details-marker { display: none; }

.day-note > summary span {
  color: #4e5968;
  font-size: 12px;
  font-weight: 800;
}

.day-note > summary b {
  padding: 4px 9px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #dce9f8;
  color: #6b7684;
  font-size: 11px;
  font-weight: 800;
}

.day-note textarea {
  width: 100%;
  display: block;
  margin: 0 0 13px;
  padding: 11px 12px;
  border: 1px solid #dce4ee;
  border-radius: 11px;
  background: #fff;
  color: var(--ink, #17171a);
  font: inherit;
  font-size: 13px;
  line-height: 1.55;
  resize: vertical;
}

.day-note textarea:focus-visible {
  outline: 3px solid rgba(10,109,240,.28);
  outline-offset: 1px;
}

/* 讓 textarea 不要頂到卡片邊 */
.day-note[open] > summary { padding-bottom: 4px; }
.day-note textarea { width: calc(100% - 26px); margin-left: 13px; }

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
  font-size: 12px;
  line-height: 1.25;
  font-weight: 850;
  overflow-wrap: anywhere;
}

/* 分類保持灰色低調：它永遠都在，彩色要留給偶爾出現的 status。 */
.journey-type {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border: 1px solid #e4e7ec;
  border-radius: 7px;
  background: #f4f6f8;
  color: #616a75;
  font-size: 12px;
  font-weight: 800;
}

.journey-status {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 850;
}

.status-decision { border-color: #f0d39b; background: #fff7e6; color: #966000; }
.status-optional { border-color: #cedff5; background: #f1f6fc; color: #476987; }
.status-choice { border-color: #c3dfd5; background: #eff8f4; color: #167253; }
/* 空白時段：刻意做成綠色的「這裡不用做事」，跟其他需要動作的標記區隔開。 */
.status-free { border-color: #bfe2d5; background: #f1f9f5; color: #16835b; }

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

/*
 * note 是「現場才會用到」的提醒：禮儀、免稅、轉場風險。刻意做得比 desc 弱一階，
 * 讓時間軸掃讀時不會被打斷，但停下來看某一站時找得到。
 */
.journey-content > p.journey-note {
  margin-top: 8px;
  padding: 8px 10px;
  border-left: 2px solid #f0c97b;
  border-radius: 0 8px 8px 0;
  background: #fffaf0;
  color: #7a6224;
  font-size: 13px;
  line-height: 1.55;
}

.choice-list {
  display: grid;
  gap: 6px;
  margin-top: 11px;
}

.choice-row {
  min-width: 0;
  min-height: 58px;
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border: 1px solid #e1e8ef;
  border-radius: 11px;
  background: #fafbfc;
}

.choice-row > span:first-child {
  color: #167253;
  font-size: 11px;
  font-weight: 850;
}

.choice-copy {
  min-width: 0;
}

.choice-copy strong,
.choice-copy small {
  display: block;
}

.choice-copy strong {
  font-size: 13px;
  line-height: 1.35;
}

.choice-copy small {
  margin-top: 2px;
  color: #70757b;
  font-size: 11px;
  line-height: 1.4;
}

.choice-row > b {
  color: #8a929c;
  font-size: 11px;
  letter-spacing: .08em;
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
  min-height: 44px;
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

  /*
   * 不要讓按鈕拉伸填滿整行。原本 flex:1 1 auto 加上 primary 強制 100%，
   * 會讓「清水寺」三個字獨佔一個滿版的框，看起來像空元件。
   * 依內容寬度排列，短標籤就自然併成一列。
   */
  :deep(.action) {
    min-height: 44px;
    flex: 0 1 auto;
  }
}
</style>
