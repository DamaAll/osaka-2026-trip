<script setup>
import { layout, prepare, setLocale } from '@chenglou/pretext'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import tripData from '../data.js'
import DaySection from './components/DaySection.vue'

const trip = tripData || { quickLinks: [], costs: [], days: [], travelInfo: [], checklist: [] }
const navLabels = ['抵達', '購物', '京都', 'USJ', '回台']
const quickMarks = ['SIM', 'VJW', '役', 'USJ']
const activeDay = ref(trip.days[0]?.id || '')
const isOnline = ref(navigator.onLine)
const checks = reactive({})
let observer
let pretextObserver
let pretextFrame
const preparedText = new Map()

const checklistItems = computed(() => trip.checklist.flatMap(([, items]) => items))
const completedCount = computed(() => checklistItems.value.filter(([key]) => checks[key]).length)
const progress = computed(() => checklistItems.value.length ? Math.round((completedCount.value / checklistItems.value.length) * 100) : 0)
const criticalActions = computed(() => (trip.priorityActions || []).map(item => ({
  ...item,
  complete: !!checks[item.key]
})))
const criticalRemaining = computed(() => criticalActions.value.filter(item => !item.complete).length)

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

const scrollToChecklist = () => {
  document.getElementById('trip-checklist')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const updateNetwork = () => { isOnline.value = navigator.onLine }

const relayoutText = () => {
  cancelAnimationFrame(pretextFrame)
  pretextFrame = requestAnimationFrame(() => {
    preparedText.forEach((handle, element) => {
      const style = getComputedStyle(element)
      const lineHeight = Number.parseFloat(style.lineHeight)
      if (!element.clientWidth || !Number.isFinite(lineHeight)) return
      const result = layout(handle, element.clientWidth, lineHeight)
      element.style.height = `${Math.ceil(result.height)}px`
    })
  })
}

const prepareTextLayout = async () => {
  await document.fonts.ready
  setLocale('zh-Hant')
  document.querySelectorAll('[data-pretext]').forEach((element) => {
    preparedText.set(element, prepare(element.textContent.trim(), getComputedStyle(element).font))
  })
  pretextObserver = new ResizeObserver(relayoutText)
  document.querySelectorAll('[data-pretext]').forEach(element => pretextObserver.observe(element))
  relayoutText()
}

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

  await prepareTextLayout()

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  pretextObserver?.disconnect()
  cancelAnimationFrame(pretextFrame)
  window.removeEventListener('online', updateNetwork)
  window.removeEventListener('offline', updateNetwork)
})
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <div class="hero-topline">
        <span class="trip-badge">OSAKA · 2026</span>
        <span class="network-pill" :class="{ offline: !isOnline }"><i></i>{{ isOnline ? '線上' : '離線可看' }}</span>
      </div>

      <div class="hero-copy">
        <p class="hero-date">09.21 MON — 09.25 FRI</p>
        <h1>大阪 5 天 4 夜</h1>
        <p class="hero-subtitle">4 人旅行 · 心齋橋 3 晚 · 9/24 環球塔 · Peach / KIX T2</p>
      </div>

      <div class="route-strip" aria-label="旅程路線">
        <span>大阪</span><i></i><span>京都</span><i></i><span>USJ</span><i></i><span>KIX</span>
      </div>

      <div class="hero-status-grid">
        <div class="status-card status-card-main">
          <span>行程狀態</span>
          <strong>{{ countdownText }}</strong>
        </div>
        <div class="status-card">
          <span>關鍵任務</span>
          <strong>{{ criticalRemaining }} 未完成</strong>
        </div>
        <div class="status-card">
          <span>行程天數</span>
          <strong>5D4N</strong>
        </div>
      </div>
      <div class="progress-track" aria-label="Checklist 完成進度">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
    </section>

    <section class="notice-card">
      <div class="notice-icon">!</div>
      <div><strong>9/21–9/23 日本連續假期</strong><span>9/21 敬老日、9/22 國民休日、9/23 秋分日；京都 9/23 一定早出。</span></div>
    </section>

    <section class="content-section command-section" aria-labelledby="command-title">
      <div class="section-title-row command-title-row">
        <div><p class="section-kicker">TRIP CONTROL</p><h2 id="command-title">出發前最後防線</h2><p class="section-caption" data-pretext>先清掉會讓四個人卡在現場的項目，再處理一般行李。</p></div>
        <button class="command-count" type="button" @click="scrollToChecklist">
          <strong>{{ criticalRemaining }}</strong><span>未完成</span>
        </button>
      </div>

      <div class="critical-list">
        <label
          v-for="item in criticalActions"
          :key="item.key"
          class="critical-row"
          :class="{ complete: item.complete }"
        >
          <input type="checkbox" :checked="item.complete" @change="updateCheck(item.key, $event.target.checked)" />
          <span class="critical-indicator" aria-hidden="true"></span>
          <span class="critical-copy">
            <small>{{ item.deadline }}</small>
            <strong>{{ item.title }}</strong>
            <span data-pretext>{{ item.desc }}</span>
          </span>
          <b>{{ item.complete ? 'DONE' : item.level }}</b>
        </label>
      </div>

      <div class="decision-grid" aria-label="現場切換規則">
        <article v-for="decision in trip.decisions" :key="decision.title" class="decision-card" :class="`decision-${decision.tone}`">
          <div class="decision-topline"><span>{{ decision.when }}</span><b>{{ decision.badge }}</b></div>
          <h3>{{ decision.title }}</h3>
          <p data-pretext>{{ decision.rule }}</p>
          <a v-if="decision.url" :href="decision.url" target="_blank" rel="noopener noreferrer">{{ decision.action }}</a>
        </article>
      </div>
    </section>

    <section class="content-section">
      <div class="section-title-row">
        <div><p class="section-kicker">PRE-TRIP</p><h2>出發前快速連結</h2><p class="section-caption">常用入口集中在這裡，出發前逐一確認。</p></div>
      </div>
      <div class="quick-grid">
        <a v-for="(item, index) in trip.quickLinks" :key="item.title" class="quick-card" :href="item.url" target="_blank" rel="noopener noreferrer">
          <div class="quick-card-top"><span class="quick-mark">{{ quickMarks[index] || String(index + 1).padStart(2, '0') }}</span><span class="quick-arrow">↗</span></div>
          <div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div>
        </a>
      </div>
    </section>

    <section class="content-section">
      <div class="section-title-row">
        <div><p class="section-kicker">BUDGET</p><h2>交通費速覽</h2><p class="section-caption">先抓固定交通費，計程車與臨時移動另外算。</p></div>
      </div>
      <div class="cost-grid">
        <div v-for="([cost, label], index) in trip.costs" :key="index" class="cost-card" :class="{ total: index === trip.costs.length - 1 }">
          <span class="cost-sequence">{{ index === trip.costs.length - 1 ? 'TOTAL' : `0${index + 1}` }}</span>
          <strong>{{ cost }}</strong><span class="cost-label">{{ label }}</span>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="section-title-row">
        <div><p class="section-kicker">USJ</p><h2>Express Pass 決策</h2><p class="section-caption">價格合適就直接買，不把 USJ 的時間浪費在排隊。</p></div>
      </div>
      <div class="express-card">
        <div class="express-visual">
          <span class="eyebrow-badge">RECOMMENDED</span>
          <strong>EXPRESS<br>PASS 5</strong>
          <small>09 / 24</small>
        </div>
        <div class="express-copy">
          <p class="express-price">¥16,800 <small>起 / 人</small></p>
          <p>優先找含 Donkey Kong、Mario Kart、Flying Dinosaur、Harry Potter 的組合。</p>
          <div class="soft-note"><b>購買規則：</b>KKday 選 9/24，4 人都有同方案且每人 ≤ ¥20,000 就買；超過就改看其他 Pass 4 / Halloween 組合。</div>
          <a class="primary-cta" href="https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka" target="_blank" rel="noopener noreferrer"><span>查看 KKday Express Pass</span><b>↗</b></a>
        </div>
      </div>
    </section>

    <section class="content-section days-section">
      <div class="section-title-row">
        <div><p class="section-kicker">ITINERARY</p><h2>D1–D5 行程</h2><p class="section-caption">照時間往下走；交通細節與導航都直接放在當天。</p></div>
      </div>
      <DaySection v-for="day in trip.days" :key="day.id" :day="day" />
    </section>

    <section class="content-section">
      <div class="section-title-row">
        <div><p class="section-kicker">ESSENTIALS</p><h2>eSIM / 手機 / 交通</h2><p class="section-caption">到日本後最常用的四件事。</p></div>
      </div>
      <div class="info-grid">
        <article v-for="(item, index) in trip.travelInfo" :key="item.title" class="info-card">
          <span class="info-index">0{{ index + 1 }}</span><div><h3>{{ item.title }}</h3><p>{{ item.desc }}</p></div>
        </article>
      </div>
    </section>

    <section id="trip-checklist" class="content-section checklist-section section-anchor">
      <div class="section-title-row checklist-title-row">
        <div><p class="section-kicker">CHECKLIST</p><h2>出發前確認</h2><p class="section-caption">勾選狀態會存在這支手機裡。</p></div>
        <button class="text-button" type="button" @click="resetChecklist">重設</button>
      </div>
      <div class="checklist-summary">
        <div class="checklist-ring" :style="{ '--progress': `${progress * 3.6}deg` }"><span>{{ progress }}%</span></div>
        <div><strong>{{ completedCount }} / {{ checklistItems.length }}</strong><span>項目已完成</span></div>
      </div>
      <div class="check-groups">
        <section v-for="([group, items]) in trip.checklist" :key="group" class="check-group">
          <h3>{{ group }}</h3>
          <label v-for="([key, title, desc]) in items" :key="key" class="check-row" :class="{ checked: !!checks[key] }">
            <input type="checkbox" :checked="!!checks[key]" @change="updateCheck(key, $event.target.checked)" />
            <span class="custom-check">✓</span>
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
    <div class="bottom-nav-inner">
      <button
        v-for="(day, index) in trip.days"
        :key="day.id"
        type="button"
        :class="['day-nav-button', { active: activeDay === day.id }]"
        @click="scrollToDay(day.id)"
      >
        <strong>D{{ index + 1 }}</strong><span>{{ navLabels[index] }}</span>
      </button>
    </div>
  </nav>
</template>
