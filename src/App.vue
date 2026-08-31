<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import DaySection from './components/DaySection.vue'

const trip = window.TRIP_DATA || { quickLinks: [], costs: [], days: [], travelInfo: [], checklist: [] }
const navLabels = ['抵達', '購物', '京都', 'USJ', '回台']
const activeDay = ref(trip.days[0]?.id || '')
const isOnline = ref(navigator.onLine)
const checks = reactive({})
let observer

const checklistItems = computed(() => trip.checklist.flatMap(([, items]) => items))
const completedCount = computed(() => checklistItems.value.filter(([key]) => checks[key]).length)
const progress = computed(() => checklistItems.value.length ? Math.round((completedCount.value / checklistItems.value.length) * 100) : 0)

const countdownText = computed(() => {
  const start = new Date('2026-09-21T00:00:00+09:00')
  const end = new Date('2026-09-26T00:00:00+09:00')
  const now = new Date()
  const oneDay = 86400000
  if (now < start) return `距出發 ${Math.ceil((start - now) / oneDay)} 天`
  if (now >= start && now < end) return '旅行進行中'
  return '旅程已結束'
})

const loadChecks = () => {
  checklistItems.value.forEach(([key]) => {
    checks[key] = localStorage.getItem(`osaka_2026_${key}`) === '1'
  })
}

const updateCheck = (key, value) => {
  checks[key] = value
  localStorage.setItem(`osaka_2026_${key}`, value ? '1' : '0')
}

const resetChecklist = () => {
  if (!window.confirm('要清除所有行前 Checklist 勾選狀態嗎？')) return
  checklistItems.value.forEach(([key]) => updateCheck(key, false))
}

const scrollToDay = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const updateNetwork = () => { isOnline.value = navigator.onLine }

onMounted(async () => {
  loadChecks()
  window.addEventListener('online', updateNetwork)
  window.addEventListener('offline', updateNetwork)

  await nextTick()
  observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible) activeDay.value = visible.target.id
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.1, 0.25, 0.5] })

  document.querySelectorAll('.day-section').forEach(el => observer.observe(el))

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('online', updateNetwork)
  window.removeEventListener('offline', updateNetwork)
})
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <div class="hero-topline">
        <span>大阪 · 2026.09.21 — 09.25</span>
        <span class="network-pill" :class="{ offline: !isOnline }">{{ isOnline ? '● 線上' : '● 離線可看' }}</span>
      </div>
      <h1>大阪 5 天 4 夜</h1>
      <p class="hero-subtitle">4 人旅行 · 心齋橋 3 晚 · 9/24 環球塔 · Peach / KIX T2</p>
      <div class="hero-chips">
        <span>👬 4 人</span><span>🎢 USJ 9/24</span><span>🛍 購物比重高</span><span>🌙 約 22:00 收</span>
      </div>
      <div class="hero-status-grid">
        <div class="status-card">
          <span>行程狀態</span>
          <strong>{{ countdownText }}</strong>
        </div>
        <div class="status-card">
          <span>行前 Checklist</span>
          <strong>{{ completedCount }} / {{ checklistItems.length }}</strong>
        </div>
      </div>
      <div class="progress-track" aria-label="Checklist 完成進度">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
    </section>

    <section class="notice-card">
      <strong>9/21–9/23 日本連續假期</strong>
      <span>9/21 敬老日、9/22 國民休日、9/23 秋分日；京都 9/23 一定早出。</span>
    </section>

    <section class="content-section">
      <div class="section-title-row"><div><p class="section-kicker">PRE-TRIP</p><h2>出發前快速連結</h2></div></div>
      <div class="quick-grid">
        <a v-for="item in trip.quickLinks" :key="item.title" class="quick-card" :href="item.url" target="_blank" rel="noopener noreferrer">
          <div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div><span>開啟 ↗</span>
        </a>
      </div>
    </section>

    <section class="content-section">
      <div class="section-title-row"><div><p class="section-kicker">BUDGET</p><h2>交通費速覽</h2></div></div>
      <div class="cost-grid">
        <div v-for="([cost, label], index) in trip.costs" :key="index" class="cost-card" :class="{ total: index === trip.costs.length - 1 }">
          <strong>{{ cost }}</strong><span>{{ label }}</span>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="section-title-row"><div><p class="section-kicker">USJ</p><h2>Express Pass 決策</h2></div></div>
      <div class="express-card">
        <div>
          <span class="eyebrow-badge">首選</span>
          <h3>Express Pass 5</h3>
          <p class="express-price">¥16,800 起</p>
          <p>優先找含 Donkey Kong、Mario Kart、Flying Dinosaur、Harry Potter 的組合。</p>
          <div class="soft-note"><b>購買規則：</b>KKday 選 9/24，4 人都有同方案且每人 ≤ ¥20,000 就買；超過就改看其他 Pass 4 / Halloween 組合。</div>
        </div>
        <a class="primary-cta" href="https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka" target="_blank" rel="noopener noreferrer">查看 KKday Express Pass</a>
      </div>
    </section>

    <section class="content-section days-section">
      <div class="section-title-row"><div><p class="section-kicker">ITINERARY</p><h2>D1–D5 行程</h2></div></div>
      <DaySection v-for="day in trip.days" :key="day.id" :day="day" />
    </section>

    <section class="content-section">
      <div class="section-title-row"><div><p class="section-kicker">ESSENTIALS</p><h2>eSIM / 手機 / 交通</h2></div></div>
      <div class="info-grid">
        <article v-for="item in trip.travelInfo" :key="item.title" class="info-card">
          <h3>{{ item.title }}</h3><p>{{ item.desc }}</p>
        </article>
      </div>
    </section>

    <section class="content-section checklist-section">
      <div class="section-title-row checklist-title-row">
        <div><p class="section-kicker">CHECKLIST</p><h2>出發前確認</h2></div>
        <button class="text-button" type="button" @click="resetChecklist">重設</button>
      </div>
      <div class="checklist-summary"><strong>{{ progress }}%</strong><span>已完成 {{ completedCount }} / {{ checklistItems.length }}</span></div>
      <div class="check-groups">
        <section v-for="([group, items]) in trip.checklist" :key="group" class="check-group">
          <h3>{{ group }}</h3>
          <label v-for="([key, title, desc]) in items" :key="key" class="check-row">
            <input type="checkbox" :checked="!!checks[key]" @change="updateCheck(key, $event.target.checked)" />
            <span class="check-copy"><strong>{{ title }}</strong><small>{{ desc }}</small></span>
          </label>
        </section>
      </div>
    </section>

    <footer class="site-footer">
      <p>少折返、少排隊，把時間留給真的想玩的地方。</p>
      <small>公開頁面只放行程資訊，不包含訂位代碼、電子機票憑證、票號、護照或 QR Code。</small>
    </footer>
  </main>

  <nav class="bottom-nav" aria-label="每日行程">
    <button
      v-for="(day, index) in trip.days"
      :key="day.id"
      type="button"
      :class="['day-nav-button', { active: activeDay === day.id }]"
      @click="scrollToDay(day.id)"
    >
      <strong>D{{ index + 1 }}</strong><span>{{ navLabels[index] }}</span>
    </button>
  </nav>
</template>
