<script setup>
import { layout, prepare, setLocale } from '@chenglou/pretext'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import tripData from '../data.js'
import DaySection from './components/DaySection.vue'

const trip = tripData || { quickLinks: [], costs: [], days: [], checklist: [] }
const navLabels = ['抵達', '購物', '京都', 'USJ', '回台']
const quickMarks = ['SIM', 'VJW', '役', 'USJ']
const views = ['itinerary', 'prep', 'money', 'buy', 'safety']
const shoppingCategories = ['藥妝 / 日用品', '動漫 / 模型', '3C / 相機', '服飾 / 鞋', '伴手禮', 'USJ', '其他']
const shoppingOwners = ['共用', '成員 1', '成員 2', '成員 3', '成員 4']
const shoppingStorageKey = 'osaka_2026_shopping_entries'
const shoppingBudgetKey = 'osaka_2026_shopping_budget'
const emergencyStorageKey = 'osaka_2026_emergency_info'
const dayNotesKey = 'osaka_2026_day_notes'
const tripStart = new Date('2026-09-21T00:00:00+09:00')
const tripEnd = new Date('2026-09-26T00:00:00+09:00')
const oneDay = 86400000
const activeView = ref('itinerary')
// 完整 hero 只在剛打開時出現一次；開始切分頁＝開始做事，就收成細長條，不再擋住內容。
const heroCompact = ref(false)
const activeDay = ref(trip.days[0]?.id || '')
const isOnline = ref(navigator.onLine)
const checks = reactive({})
const shoppingEntries = ref([])
const shoppingBudget = ref(0)
const shoppingDraft = reactive({ name: '', category: shoppingCategories[0], owner: shoppingOwners[0], price: '', quantity: 1 })
const shoppingError = ref('')
const dataMessage = ref('')
const fileInput = ref(null)
const emergencyInfo = reactive({ hotelName: '', hotelAddress: '', hotelPhone: '', booking: '', insurance: '', contact: '' })
const emergencyError = ref('')
// 旅行中隨手記（店名、明天要補買的東西），也讓這頁在回國後還留得住東西。
const dayNotes = reactive({})
let observer
let pretextObserver
let pretextFrame
const preparedText = new Map()

const lineTotal = (item) => Math.max(0, Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1)

const checklistItems = computed(() => trip.checklist.flatMap(([, items]) => items))
const completedCount = computed(() => checklistItems.value.filter(([key]) => checks[key]).length)
const progress = computed(() => checklistItems.value.length ? Math.round((completedCount.value / checklistItems.value.length) * 100) : 0)
const shoppingTotal = computed(() => shoppingEntries.value.reduce((total, item) => total + lineTotal(item), 0))
const shoppingSharedTotal = computed(() => shoppingEntries.value.reduce((total, item) => (
  item.owner === '共用' ? total + lineTotal(item) : total
), 0))
const shoppingAverage = computed(() => shoppingSharedTotal.value / 4)
const shoppingRemaining = computed(() => Math.max(0, Number(shoppingBudget.value) || 0) - shoppingTotal.value)
const shoppingSplit = computed(() => {
  const perShared = shoppingSharedTotal.value / 4
  return shoppingOwners.slice(1).map(owner => {
    const own = shoppingEntries.value.reduce((total, item) => (
      item.owner === owner ? total + lineTotal(item) : total
    ), 0)
    return { owner, own, shared: perShared, total: own + perShared }
  })
})

const criticalActions = computed(() => (trip.priorityActions || []).map(item => ({
  ...item,
  complete: !!checks[item.key]
})))
const criticalRemaining = computed(() => criticalActions.value.filter(item => !item.complete).length)

// 依日期決定「現在該看什麼」：出發前看準備，旅行中看當天，結束後收起來。
const tripPhase = computed(() => {
  const now = new Date()
  if (now >= tripEnd) return 'after'
  if (now >= tripStart) return 'during'
  return 'before'
})

const daysToStart = computed(() => Math.ceil((tripStart - new Date()) / oneDay))

/*
 * 「我現在該在哪一站」是旅行中最常問的一句，而這頁有 18 個螢幕高。
 * 站點時間格式不一（08:25–09:05 / 15:15 決定 / 白天 / 閉園後），
 * 解析得出開始時間的才納入判斷，其餘略過。
 */
const startMinutes = (time) => {
  const match = String(time).match(/^(\d{1,2}):(\d{2})/)
  return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

const nowMinutes = ref(0)
// 一定要用日本時間算。手機若還停在台灣時區就會慢一小時，
// 那會讓「現在」指到上一站——比不標示更糟。
const japanClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false
})
const readClock = () => {
  const parts = japanClock.formatToParts(new Date())
  const hour = Number(parts.find(part => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find(part => part.type === 'minute')?.value ?? 0)
  nowMinutes.value = hour * 60 + minute
}
let clockTimer

const todayId = computed(() => (currentDayIndex.value >= 0 ? trip.days[currentDayIndex.value].id : ''))

// 最後一個「已經該開始」的站就是現在的位置；下一個還沒到的就是下一站。
const todayProgress = computed(() => {
  if (!todayId.value) return { current: -1, next: -1 }
  const items = trip.days[currentDayIndex.value].items
  let current = -1
  let next = -1
  items.forEach((item, index) => {
    const start = startMinutes(item.time)
    if (start === null) return
    if (start <= nowMinutes.value) current = index
    else if (next === -1) next = index
  })
  return { current, next }
})

const currentDayIndex = computed(() => {
  if (tripPhase.value !== 'during') return -1
  const index = Math.floor((new Date() - tripStart) / oneDay)
  return index >= 0 && index < trip.days.length ? index : -1
})

const todayFocus = computed(() => {
  if (tripPhase.value === 'after') {
    return { kicker: '旅程結束', title: '回來了', desc: '購物清單與分帳留在「花費」分頁，對完帳就可以收起來了。', target: 'money' }
  }
  if (tripPhase.value === 'during') {
    const day = trip.days[currentDayIndex.value]
    if (day) return { kicker: `今天 · ${day.date}`, title: day.title, desc: `${day.items.length} 個站點。往下捲就是今天的時間軸與交通。`, target: 'itinerary', dayId: day.id }
    return { kicker: '旅行中', title: '看今天的時間軸', desc: '行程分頁裡有每天的交通與切換規則。', target: 'itinerary' }
  }
  if (criticalRemaining.value > 0) {
    const next = criticalActions.value.find(item => !item.complete)
    return { kicker: `距出發 ${daysToStart.value} 天`, title: `還有 ${criticalRemaining.value} 件關鍵任務`, desc: `最急的是「${next.title}」— ${next.deadline}。`, target: 'prep' }
  }
  return { kicker: `距出發 ${daysToStart.value} 天`, title: '關鍵任務都清掉了', desc: `剩下的行李與雜項在準備分頁，目前完成 ${progress.value}%。`, target: 'prep' }
})

const loadChecks = () => {
  checklistItems.value.forEach(([key]) => {
    checks[key] = localStorage.getItem(`osaka_2026_${key}`) === '1'
  })
}

/*
 * 分頁切換要 push，否則 Android 的返回鍵會直接離開網站——裝成 PWA 後那是唯一的
 * 返回方式。捲動造成的 day 變化則用 replace，不然滑一次行程就塞滿整個歷史。
 */
const updateUrlState = (push = false) => {
  const params = new URLSearchParams(window.location.search)
  params.set('view', activeView.value)
  if (activeView.value === 'itinerary' && activeDay.value) params.set('day', activeDay.value)
  else params.delete('day')
  const url = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  if (push) window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

const updateCheck = (key, value) => {
  checks[key] = value
  localStorage.setItem(`osaka_2026_${key}`, value ? '1' : '0')
}

const resetChecklist = () => {
  if (!window.confirm('要清除所有行前 Checklist 勾選狀態嗎？')) return
  checklistItems.value.forEach(([key]) => updateCheck(key, false))
}

const formatYen = (amount) => `¥${new Intl.NumberFormat('ja-JP').format(Math.round(Number(amount) || 0))}`

const persistShopping = () => {
  try {
    localStorage.setItem(shoppingStorageKey, JSON.stringify(shoppingEntries.value))
    localStorage.setItem(shoppingBudgetKey, String(Math.max(0, Number(shoppingBudget.value) || 0)))
  } catch {
    shoppingError.value = '無法儲存到這支手機，請確認瀏覽器沒有封鎖網站資料。'
  }
}

const loadShopping = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(shoppingStorageKey) || '[]')
    if (!Array.isArray(stored)) return
    shoppingEntries.value = stored
      .filter(item => item && typeof item.name === 'string')
      .map(item => ({
        id: String(item.id || `${Date.now()}-${Math.random()}`),
        name: item.name.slice(0, 80),
        category: shoppingCategories.includes(item.category) ? item.category : '其他',
        owner: shoppingOwners.includes(item.owner) ? item.owner : '共用',
        price: Math.max(0, Number(item.price) || 0),
        quantity: Math.min(99, Math.max(1, Number(item.quantity) || 1))
      }))
    shoppingBudget.value = Math.max(0, Number(localStorage.getItem(shoppingBudgetKey)) || 0)
  } catch {
    shoppingEntries.value = []
    shoppingBudget.value = 0
  }
}

const loadDayNotes = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(dayNotesKey) || '{}')
    trip.days.forEach(day => {
      dayNotes[day.id] = typeof stored[day.id] === 'string' ? stored[day.id].slice(0, 2000) : ''
    })
  } catch {
    trip.days.forEach(day => { dayNotes[day.id] = '' })
  }
}

const updateDayNote = (id, value) => {
  dayNotes[id] = value.slice(0, 2000)
  try {
    localStorage.setItem(dayNotesKey, JSON.stringify(dayNotes))
  } catch {
    // 寫不進去就算了，不要在記筆記的當下跳錯誤打斷使用者
  }
}

const noteCount = computed(() => Object.values(dayNotes).filter(text => text && text.trim()).length)

const loadEmergencyInfo = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(emergencyStorageKey) || '{}')
    Object.keys(emergencyInfo).forEach(key => {
      emergencyInfo[key] = typeof stored[key] === 'string' ? stored[key].slice(0, 160) : ''
    })
  } catch {
    emergencyError.value = '無法讀取本機緊急資訊。'
  }
}

const persistEmergencyInfo = () => {
  try {
    localStorage.setItem(emergencyStorageKey, JSON.stringify(emergencyInfo))
    emergencyError.value = ''
  } catch {
    emergencyError.value = '無法儲存到這支手機，請確認瀏覽器沒有封鎖網站資料。'
  }
}

const buildDataExport = () => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  checks: Object.fromEntries(checklistItems.value.map(([key]) => [key, !!checks[key]])),
  shopping: { budget: Math.max(0, Number(shoppingBudget.value) || 0), entries: shoppingEntries.value },
  emergency: { ...emergencyInfo },
  dayNotes: { ...dayNotes }
})

const exportData = () => {
  const blob = new Blob([JSON.stringify(buildDataExport(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'osaka-2026-trip-backup.json'
  link.click()
  URL.revokeObjectURL(url)
  dataMessage.value = '已下載本機備份檔。'
}

const openImport = () => fileInput.value?.click()

const importData = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  try {
    const parsed = JSON.parse(await file.text())
    if (!parsed || typeof parsed !== 'object' || typeof parsed.checks !== 'object') throw new Error('invalid')
    checklistItems.value.forEach(([key]) => updateCheck(key, parsed.checks[key] === true))
    const shopping = parsed.shopping || {}
    shoppingBudget.value = Math.max(0, Number(shopping.budget) || 0)
    shoppingEntries.value = Array.isArray(shopping.entries) ? shopping.entries.map(item => ({
      id: String(item.id || `${Date.now()}-${Math.random()}`),
      name: String(item.name || '').trim().slice(0, 80),
      category: shoppingCategories.includes(item.category) ? item.category : '其他',
      owner: shoppingOwners.includes(item.owner) ? item.owner : '共用',
      price: Math.max(0, Number(item.price) || 0),
      quantity: Math.min(99, Math.max(1, Number(item.quantity) || 1))
    })).filter(item => item.name) : []
    Object.keys(emergencyInfo).forEach(key => {
      emergencyInfo[key] = typeof parsed.emergency?.[key] === 'string' ? parsed.emergency[key].slice(0, 160) : ''
    })
    trip.days.forEach(day => {
      const text = parsed.dayNotes?.[day.id]
      dayNotes[day.id] = typeof text === 'string' ? text.slice(0, 2000) : ''
    })
    persistShopping()
    persistEmergencyInfo()
    try { localStorage.setItem(dayNotesKey, JSON.stringify(dayNotes)) } catch {}
    dataMessage.value = '已匯入備份，Checklist、購物、筆記與緊急資訊都已更新。'
  } catch {
    dataMessage.value = '匯入失敗，請選擇這個網站匯出的 JSON 備份檔。'
  }
}

const shareData = async () => {
  const shareText = `大阪 5 天 4 夜｜Checklist ${progress.value}%｜購物 ${formatYen(shoppingTotal.value)}`
  try {
    if (navigator.share) await navigator.share({ title: '大阪 2026 行程', text: shareText, url: window.location.href })
    else {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`)
      dataMessage.value = '已複製分享連結。'
      return
    }
    dataMessage.value = '已開啟系統分享。'
  } catch (error) {
    if (error?.name !== 'AbortError') dataMessage.value = '分享失敗，請改用匯出備份。'
  }
}

const addShoppingItem = () => {
  const name = shoppingDraft.name.trim()
  const price = Number(shoppingDraft.price)
  const quantity = Math.min(99, Math.max(1, Number(shoppingDraft.quantity) || 1))
  if (!name) {
    shoppingError.value = '請先輸入品名。'
    return
  }
  if (shoppingDraft.price === '' || !Number.isFinite(price) || price < 0) {
    shoppingError.value = '請輸入有效的日幣單價。'
    return
  }
  shoppingEntries.value.push({
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    name: name.slice(0, 80),
    category: shoppingDraft.category,
    owner: shoppingDraft.owner,
    price: Math.round(price),
    quantity
  })
  shoppingDraft.name = ''
  shoppingDraft.owner = shoppingOwners[0]
  shoppingDraft.price = ''
  shoppingDraft.quantity = 1
  shoppingError.value = ''
  persistShopping()
}

const removeShoppingItem = (id) => {
  shoppingEntries.value = shoppingEntries.value.filter(item => item.id !== id)
  persistShopping()
}

const clearShopping = () => {
  if (!shoppingEntries.value.length || !window.confirm('要清除全部購物項目嗎？')) return
  shoppingEntries.value = []
  persistShopping()
}

const scrollToDay = (id) => {
  activeDay.value = id
  updateUrlState()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const scrollToChecklist = () => {
  document.getElementById('trip-checklist')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 換分頁後要重接 observer 與文字排版，popstate 回來時也走同一條路。
const afterViewChange = async () => {
  await nextTick()
  observer?.disconnect()
  if (activeView.value === 'itinerary') {
    document.querySelectorAll('.day-section').forEach(element => observer?.observe(element))
  }
  await prepareTextLayout()
}

const switchView = async (view, anchorId) => {
  heroCompact.value = true
  if (activeView.value !== view) {
    activeView.value = view
    updateUrlState(true)
    await afterViewChange()
  }
  await nextTick()
  const target = anchorId ? document.getElementById(anchorId) : document.getElementById('view-content')
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const syncFromUrl = async () => {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view')
  const day = params.get('day')
  if (views.includes(view) && view !== activeView.value) {
    activeView.value = view
    heroCompact.value = true
    await afterViewChange()
  }
  if (trip.days.some(item => item.id === day)) activeDay.value = day
}

const openFocus = () => switchView(todayFocus.value.target, todayFocus.value.dayId)

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
  pretextObserver?.disconnect()
  preparedText.clear()
  document.querySelectorAll('[data-pretext]').forEach((element) => {
    preparedText.set(element, prepare(element.textContent.trim(), getComputedStyle(element).font))
  })
  pretextObserver = new ResizeObserver(relayoutText)
  document.querySelectorAll('[data-pretext]').forEach(element => pretextObserver.observe(element))
  relayoutText()
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  loadChecks()
  loadShopping()
  loadEmergencyInfo()
  loadDayNotes()
  readClock()
  clockTimer = setInterval(readClock, 60000)
  /*
   * 旅行中直接用收合版。完整 hero 佔首屏 47%，而收合條已經帶著同樣的焦點資訊；
   * 每次重開 PWA 或重新整理都要先滑過半個螢幕才看得到內容，不值得。
   */
  if (tripPhase.value === 'during') heroCompact.value = true
  if (views.includes(params.get('view'))) activeView.value = params.get('view')
  else if (tripPhase.value === 'before') activeView.value = 'prep'
  if (trip.days.some(day => day.id === params.get('day'))) activeDay.value = params.get('day')
  else if (currentDayIndex.value >= 0) activeDay.value = trip.days[currentDayIndex.value].id
  window.addEventListener('online', updateNetwork)
  window.addEventListener('offline', updateNetwork)
  window.addEventListener('popstate', syncFromUrl)

  await nextTick()
  observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (!visible || visible.target.id === activeDay.value) return
    activeDay.value = visible.target.id
    // 捲動改變了當前日，URL 也要跟上，否則重新整理會跳回別天。
    updateUrlState()
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.1, 0.25, 0.5] })

  await prepareTextLayout()

  // 旅行中打開就停在現在這一站，不要讓人從 D1 滑到今天。
  if (activeView.value === 'itinerary' && todayId.value) {
    const { current } = todayProgress.value
    const target = document.getElementById(current >= 0 ? `${todayId.value}-stop-${current}` : todayId.value)
    // 必須是瞬間捲動。html 有 scroll-behavior: smooth，動畫途中 observer 會一路
    // 吃到中間位置，最後停在錯的那一天，而且捲動結束就沒有事件能修正它。
    target?.scrollIntoView({ block: 'center', behavior: 'instant' })
    activeDay.value = todayId.value
    await nextTick()
  }

  // 一定要等捲動結束才開始觀察，否則 observer 會用捲動前的位置決定當前日。
  document.querySelectorAll('.day-section').forEach(el => observer.observe(el))

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  }
  updateUrlState()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  pretextObserver?.disconnect()
  cancelAnimationFrame(pretextFrame)
  window.removeEventListener('online', updateNetwork)
  window.removeEventListener('offline', updateNetwork)
  window.removeEventListener('popstate', syncFromUrl)
  clearInterval(clockTimer)
})
</script>

<template>
  <main class="page-shell">
    <section v-if="heroCompact" class="hero-strip" aria-labelledby="trip-title">
      <!-- 收合後仍要保留文件的 h1，否則整頁會沒有頂層標題。 -->
      <h1 id="trip-title" class="visually-hidden">大阪 5 天 4 夜</h1>
      <button type="button" class="hero-strip-main" @click="openFocus">
        <span class="hero-strip-copy">
          <small>{{ todayFocus.kicker }}</small>
          <strong>{{ todayFocus.title }}</strong>
        </span>
        <span class="hero-strip-go">開啟</span>
      </button>
      <div class="progress-track" aria-label="Checklist 完成進度">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
    </section>

    <section v-else class="hero-card">
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

      <button type="button" class="focus-card" @click="openFocus">
        <span class="focus-kicker">{{ todayFocus.kicker }}</span>
        <strong>{{ todayFocus.title }}</strong>
        <span class="focus-desc">{{ todayFocus.desc }}</span>
        <span class="focus-go">開啟</span>
      </button>

      <div class="hero-progress">
        <div class="hero-progress-label">
          <span>行前準備</span>
          <b>{{ completedCount }} / {{ checklistItems.length }} · {{ progress }}%</b>
        </div>
        <div class="progress-track" aria-label="Checklist 完成進度">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
      </div>
    </section>

    <nav class="view-tabs" role="tablist" aria-label="主要內容">
      <button id="itinerary-tab" type="button" role="tab" aria-controls="view-content" :class="{ active: activeView === 'itinerary' }" :aria-selected="activeView === 'itinerary'" @click="switchView('itinerary')">
        <strong>行程</strong><small>每天走</small>
      </button>
      <button id="prep-tab" type="button" role="tab" aria-controls="view-content" :class="{ active: activeView === 'prep' }" :aria-selected="activeView === 'prep'" @click="switchView('prep')">
        <strong>準備</strong><small>出發前</small>
      </button>
      <button id="money-tab" type="button" role="tab" aria-controls="view-content" :class="{ active: activeView === 'money' }" :aria-selected="activeView === 'money'" @click="switchView('money')">
        <strong>花費</strong><small>{{ formatYen(shoppingTotal) }}</small>
      </button>
      <button id="buy-tab" type="button" role="tab" aria-controls="view-content" :class="{ active: activeView === 'buy' }" :aria-selected="activeView === 'buy'" @click="switchView('buy')">
        <strong>買什麼</strong><small>伴手禮</small>
      </button>
      <button id="safety-tab" type="button" role="tab" aria-controls="view-content" :class="{ active: activeView === 'safety' }" :aria-selected="activeView === 'safety'" @click="switchView('safety')">
        <strong>應急</strong><small>出事看</small>
      </button>
    </nav>

    <div id="view-content" class="view-content" role="tabpanel" :aria-labelledby="`${activeView}-tab`">
      <!-- ─────────── 行程 ─────────── -->
      <template v-if="activeView === 'itinerary'">
        <section class="notice-card">
          <div class="notice-icon">!</div>
          <div><strong>9/21–9/23 日本連續假期</strong><span>9/21 敬老日、9/22 國民休日、9/23 秋分日。這三天大阪與京都都會明顯更擠。</span></div>
        </section>

        <section class="content-section command-section decision-section" aria-labelledby="decision-title">
          <div class="section-title-row command-title-row">
            <div><p class="section-kicker">LIVE RULES</p><h2 id="decision-title">現場切換規則</h2><p class="section-caption" data-pretext>時間到了就照規則切換，不在現場重新討論。</p></div>
          </div>
          <div class="decision-grid">
            <article v-for="decision in trip.decisions" :key="decision.title" class="decision-card" :class="`decision-${decision.tone}`">
              <div class="decision-topline"><span>{{ decision.when }}</span><b>{{ decision.badge }}</b></div>
              <h3>{{ decision.title }}</h3>
              <p data-pretext>{{ decision.rule }}</p>
              <a v-if="decision.url" :href="decision.url" target="_blank" rel="noopener noreferrer">{{ decision.action }}</a>
            </article>
          </div>
        </section>

        <details class="fold">
          <summary><strong>4 人一起行動的規則</strong><small>分開逛之前先看一次</small></summary>
          <div class="fold-body">
            <div class="rule-list">
              <article v-for="([title, desc]) in trip.groupRules" :key="title">
                <strong>{{ title }}</strong><p>{{ desc }}</p>
              </article>
            </div>
          </div>
        </details>

        <section class="content-section days-section">
          <div class="section-title-row">
            <div><p class="section-kicker">ITINERARY</p><h2>D1–D5 行程</h2><p class="section-caption">照時間往下走；交通、注意事項與導航都在當天。</p></div>
          </div>
          <DaySection
            v-for="day in trip.days"
            :key="day.id"
            :day="day"
            :note="dayNotes[day.id] || ''"
            :is-today="day.id === todayId"
            :collapsed="!!todayId && day.id !== todayId"
            :current-item="day.id === todayId ? todayProgress.current : -1"
            :next-item="day.id === todayId ? todayProgress.next : -1"
            @update:note="updateDayNote(day.id, $event)"
          />
        </section>
      </template>

      <!-- ─────────── 準備 ─────────── -->
      <template v-else-if="activeView === 'prep'">
        <section class="content-section command-section" aria-labelledby="command-title">
          <div class="section-title-row command-title-row">
            <div><p class="section-kicker">TRIP CONTROL</p><h2 id="command-title">出發前最後防線</h2><p class="section-caption" data-pretext>先清掉會讓四個人卡在現場的項目，再處理一般行李。</p></div>
            <button class="command-count" type="button" @click="scrollToChecklist">
              <strong>{{ criticalRemaining }}</strong><span>未完成</span>
            </button>
          </div>
          <div class="critical-list">
            <label v-for="item in criticalActions" :key="item.key" class="critical-row" :class="{ complete: item.complete }">
              <input type="checkbox" :checked="item.complete" @change="updateCheck(item.key, $event.target.checked)" />
              <span class="critical-indicator" aria-hidden="true"></span>
              <span class="critical-copy"><small>{{ item.deadline }}</small><strong>{{ item.title }}</strong><span data-pretext>{{ item.desc }}</span></span>
              <b>{{ item.complete ? 'DONE' : item.level }}</b>
            </label>
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

        <section class="content-section">
          <div class="section-title-row"><div><p class="section-kicker">REFERENCE</p><h2>出發前要先弄懂的事</h2><p class="section-caption">平常收起來，需要的時候再點開。</p></div></div>

          <details class="fold">
            <summary><strong>手機與交通卡</strong><small>{{ trip.connectivity.caption }}</small></summary>
            <div class="fold-body">
              <div class="tone-list">
                <article v-for="group in trip.connectivity.groups" :key="group.title" :class="`tone-${group.tone}`">
                  <strong>{{ group.title }}</strong><p>{{ group.desc }}</p>
                </article>
              </div>
              <p class="fold-note">{{ trip.connectivity.esim }}</p>
            </div>
          </details>

          <details class="fold">
            <summary><strong>免稅怎麼買才不會出錯</strong><small>{{ trip.taxFree.caption }}</small></summary>
            <div class="fold-body">
              <div class="rule-list">
                <article v-for="([title, desc]) in trip.taxFree.rules" :key="title">
                  <strong>{{ title }}</strong><p>{{ desc }}</p>
                </article>
              </div>
              <p class="fold-warning">{{ trip.taxFree.warning }}</p>
              <a class="fold-link" :href="trip.taxFree.sourceUrl" target="_blank" rel="noopener noreferrer">觀光廳 免稅制度官方說明</a>
            </div>
          </details>

          <details class="fold">
            <summary><strong>Peach 行李額度</strong><small>{{ trip.baggage.caption }}</small></summary>
            <div class="fold-body">
              <div class="pair-row">
                <div><small>手提</small><strong>{{ trip.baggage.carryOn }}</strong></div>
                <div><small>托運</small><strong>{{ trip.baggage.checked }}</strong></div>
              </div>
              <div class="rule-list">
                <article v-for="([title, desc]) in trip.baggage.rules" :key="title">
                  <strong>{{ title }}</strong><p>{{ desc }}</p>
                </article>
              </div>
              <p class="fold-warning">{{ trip.baggage.warning }}</p>
            </div>
          </details>

          <details class="fold">
            <summary><strong>訂位與吃飯</strong><small>{{ trip.dining.caption }}</small></summary>
            <div class="fold-body">
              <div class="reservation-list">
                <article v-for="([when, place, note, state]) in trip.dining.reservations" :key="place" :class="`reservation-${state}`">
                  <span>{{ when }}</span><strong>{{ place }}</strong><small>{{ note }}</small>
                </article>
              </div>
              <div class="rule-list">
                <article v-for="([title, desc]) in trip.dining.tips" :key="title">
                  <strong>{{ title }}</strong><p>{{ desc }}</p>
                </article>
              </div>
              <p class="fold-note"><b>過敏對照句：</b>{{ trip.dining.allergyCard }}</p>
            </div>
          </details>

          <details class="fold">
            <summary><strong>USJ Express Pass 決策</strong><small>價格合適就買，不把 USJ 時間浪費在排隊</small></summary>
            <div class="fold-body">
              <div class="express-card">
                <div class="express-visual"><span class="eyebrow-badge">RECOMMENDED</span><strong>EXPRESS<br>PASS 5</strong><small>09 / 24</small></div>
                <div class="express-copy">
                  <p class="express-price">¥16,800 <small>起 / 人</small></p>
                  <p>優先找含 Donkey Kong、Mario Kart、Flying Dinosaur、Harry Potter 的組合。</p>
                  <div class="soft-note"><b>購買規則：</b>9/24 在萬聖節期間，價格通常高於平日。4 人同方案且每人 ≤ ¥20,000 就買；超過就改看 Pass 4 或萬聖節組合。</div>
                  <a class="primary-cta" href="https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka" target="_blank" rel="noopener noreferrer"><span>查看 KKday Express Pass</span><b>OPEN</b></a>
                </div>
              </div>
            </div>
          </details>
        </section>

        <section class="content-section">
          <div class="section-title-row"><div><p class="section-kicker">PRE-TRIP</p><h2>快速連結</h2><p class="section-caption">常用入口集中在這裡。</p></div></div>
          <div class="quick-grid">
            <a v-for="(item, index) in trip.quickLinks" :key="item.title" class="quick-card" :href="item.url" target="_blank" rel="noopener noreferrer">
              <div class="quick-card-top"><span class="quick-mark">{{ quickMarks[index] || String(index + 1).padStart(2, '0') }}</span><span class="quick-arrow">OPEN</span></div>
              <div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div>
            </a>
          </div>
        </section>

        <details class="fold">
          <summary><strong>換手機或給同行者用</strong><small>資料只存在這支手機，用備份檔搬移</small></summary>
          <div class="fold-body">
            <div class="data-tools-actions">
              <button type="button" class="secondary-cta" @click="exportData">匯出備份</button>
              <button type="button" class="secondary-cta" @click="openImport">匯入備份</button>
              <button type="button" class="secondary-cta" @click="shareData">分享連結</button>
              <input ref="fileInput" class="visually-hidden" type="file" accept="application/json,.json" @change="importData" />
            </div>
            <p v-if="dataMessage" class="data-message" role="status">{{ dataMessage }}</p>
          </div>
        </details>
      </template>

      <!-- ─────────── 花費 ─────────── -->
      <template v-else-if="activeView === 'money'">
        <section class="content-section money-section" aria-labelledby="money-title">
          <div class="section-title-row">
            <div><p class="section-kicker">MONEY</p><h2 id="money-title">日幣要準備多少</h2><p class="section-caption">大額購物刷卡，現金留給加值、小店與備援。</p></div>
          </div>
          <div class="money-hero">
            <div><small>每人實體現金</small><strong>{{ trip.moneyPlan.cashPerPerson }}</strong><span>建議分兩處保管</span></div>
            <div><small>4 人現金合計</small><strong>{{ trip.moneyPlan.cashForGroup }}</strong><span>不要由同一人全拿</span></div>
          </div>
          <div class="trip-budget-row">
            <span><small>整趟基本支出預估</small><strong>{{ trip.moneyPlan.tripBudget }}</strong></span>
            <p data-pretext>{{ trip.moneyPlan.tripBudgetNote }}</p>
          </div>
          <div class="money-breakdown">
            <article v-for="([title, amount, note]) in trip.moneyPlan.breakdown" :key="title">
              <span><strong>{{ title }}</strong><b>{{ amount }}</b></span>
              <p>{{ note }}</p>
            </article>
          </div>
          <a class="money-source" :href="trip.moneyPlan.sourceUrl" target="_blank" rel="noopener noreferrer">日本官方支付方式說明</a>
        </section>

        <section class="content-section">
          <div class="section-title-row"><div><p class="section-kicker">TICKETS</p><h2>門票與入場費</h2><p class="section-caption">{{ trip.tickets.caption }}</p></div></div>
          <div class="ticket-list">
            <article v-for="([name, price, note]) in trip.tickets.items" :key="name">
              <div><strong>{{ name }}</strong><b>{{ price }}</b></div>
              <p>{{ note }}</p>
            </article>
          </div>
          <p class="fold-note">{{ trip.tickets.note }}</p>
          <p class="verified-tag">票價最後確認 {{ trip.verifiedAt }}，出發前再核一次</p>
        </section>

        <section class="content-section">
          <div class="section-title-row"><div><p class="section-kicker">TRANSPORT</p><h2>交通費速覽</h2><p class="section-caption">固定交通費；計程車與門票另計。</p></div></div>
          <div class="cost-grid">
            <div v-for="([cost, label], index) in trip.costs" :key="index" class="cost-card" :class="{ total: index === trip.costs.length - 1 }">
              <span class="cost-sequence">{{ index === trip.costs.length - 1 ? 'TOTAL' : `0${index + 1}` }}</span>
              <strong>{{ cost }}</strong><span class="cost-label">{{ label }}</span>
            </div>
          </div>
          <p class="verified-tag">車資最後確認 {{ trip.verifiedAt }}，巴士時刻以官方頁面為準</p>
        </section>

        <section class="content-section shopping-builder" aria-labelledby="shopping-title">
          <div class="section-title-row shopping-title-row">
            <div><p class="section-kicker">SHOPPING</p><h2 id="shopping-title">購物與分帳</h2><p class="section-caption">自行新增品項；標「共用」的會平均分給 4 個人。</p></div>
            <button class="text-button" type="button" :disabled="!shoppingEntries.length" @click="clearShopping">全部清除</button>
          </div>

          <div class="shopping-summary">
            <div><small>目前總額</small><strong>{{ formatYen(shoppingTotal) }}</strong><span>{{ shoppingEntries.length }} 個品項</span></div>
            <div><small>共用平均</small><strong>{{ formatYen(shoppingAverage) }}</strong><span>共用品項 ÷ 4</span></div>
          </div>
          <label class="shopping-budget"><span>購物預算上限（日幣，可不填）</span><input v-model.number="shoppingBudget" type="number" min="0" step="100" inputmode="numeric" placeholder="例如：60000" @input="persistShopping" /></label>
          <p v-if="shoppingBudget" class="shopping-remaining" :class="{ over: shoppingTotal > shoppingBudget }">{{ shoppingTotal > shoppingBudget ? '已超過預算' : '預算剩餘' }} <strong>{{ formatYen(shoppingRemaining) }}</strong></p>

          <div v-if="shoppingEntries.length" class="split-table">
            <p class="split-caption">每個人實際要付</p>
            <div v-for="row in shoppingSplit" :key="row.owner" class="split-row">
              <strong>{{ row.owner }}</strong>
              <span>個人 {{ formatYen(row.own) }} ＋ 共用 {{ formatYen(row.shared) }}</span>
              <b>{{ formatYen(row.total) }}</b>
            </div>
          </div>

          <form class="shopping-form" @submit.prevent="addShoppingItem">
            <label class="field-name"><span>品名</span><input v-model="shoppingDraft.name" type="text" maxlength="80" autocomplete="off" placeholder="例如：USJ 瑪利歐帽" /></label>
            <label><span>分類</span><select v-model="shoppingDraft.category"><option v-for="category in shoppingCategories" :key="category" :value="category">{{ category }}</option></select></label>
            <label><span>歸屬</span><select v-model="shoppingDraft.owner"><option v-for="owner in shoppingOwners" :key="owner" :value="owner">{{ owner }}</option></select></label>
            <label><span>單價（日幣）</span><input v-model="shoppingDraft.price" type="number" min="0" step="1" inputmode="numeric" placeholder="0" /></label>
            <label><span>數量</span><input v-model="shoppingDraft.quantity" type="number" min="1" max="99" step="1" inputmode="numeric" /></label>
            <button class="add-shopping-button" type="submit">加入購物清單</button>
          </form>
          <p v-if="shoppingError" class="shopping-error" role="alert">{{ shoppingError }}</p>

          <div v-if="shoppingEntries.length" class="shopping-entry-list">
            <article v-for="item in shoppingEntries" :key="item.id" class="shopping-entry">
              <div class="shopping-entry-topline"><span>{{ item.category }}</span><button type="button" :aria-label="`刪除 ${item.name}`" @click="removeShoppingItem(item.id)">刪除</button></div>
              <label class="entry-name"><span>品名</span><input v-model.trim="item.name" type="text" maxlength="80" @input="persistShopping" /></label>
              <div class="entry-numbers">
                <label><span>歸屬</span><select v-model="item.owner" @change="persistShopping"><option v-for="owner in shoppingOwners" :key="owner" :value="owner">{{ owner }}</option></select></label>
                <label><span>單價</span><input v-model.number="item.price" type="number" min="0" step="1" inputmode="numeric" @input="persistShopping" /></label>
                <label><span>數量</span><input v-model.number="item.quantity" type="number" min="1" max="99" step="1" inputmode="numeric" @input="persistShopping" /></label>
                <output><span>小計</span><strong>{{ formatYen(lineTotal(item)) }}</strong></output>
              </div>
            </article>
          </div>
          <div v-else class="shopping-empty"><strong>還沒有購物項目</strong><span>先從上方輸入第一個想買的東西。</span></div>
        </section>
      </template>

      <!-- ─────────── 買什麼 ─────────── -->
      <template v-else-if="activeView === 'buy'">
        <section class="content-section" aria-labelledby="buy-title">
          <div class="section-title-row">
            <div><p class="section-kicker">SHOPPING IDEAS</p><h2 id="buy-title">不知道買什麼的時候</h2><p class="section-caption" data-pretext>{{ trip.souvenirs.caption }}</p></div>
          </div>
        </section>

        <section class="content-section buy-banned" aria-labelledby="banned-title">
          <div class="section-title-row">
            <div><p class="section-kicker banned-kicker">先看這個</p><h2 id="banned-title">{{ trip.souvenirs.banned.title }}</h2></div>
          </div>
          <div class="rule-list">
            <article v-for="([title, desc]) in trip.souvenirs.banned.items" :key="title">
              <strong>{{ title }}</strong><p>{{ desc }}</p>
            </article>
          </div>
        </section>

        <section class="content-section">
          <div class="section-title-row"><div><p class="section-kicker">BY DAY</p><h2>按你哪天會走到分</h2><p class="section-caption">平常收起來，逛到那一區再點開。</p></div></div>
          <details v-for="group in trip.souvenirs.groups" :key="group.key" class="fold">
            <summary><strong>{{ group.title }}</strong><small>{{ group.where }} · {{ group.items.length }} 項</small></summary>
            <div class="fold-body">
              <p v-if="group.note" class="fold-warning">{{ group.note }}</p>
              <div class="buy-list">
                <article v-for="([name, desc]) in group.items" :key="name">
                  <strong>{{ name }}</strong><p>{{ desc }}</p>
                </article>
              </div>
            </div>
          </details>
          <p class="verified-tag">品項參考整理於 {{ trip.verifiedAt }}；價格與限定品會變動</p>
        </section>
      </template>

      <!-- ─────────── 應急 ─────────── -->
      <template v-else>
        <section class="content-section" aria-labelledby="hotline-title">
          <div class="section-title-row"><div><p class="section-kicker">CALL</p><h2 id="hotline-title">緊急電話</h2><p class="section-caption">直接點就能撥號。出發前先存進手機通訊錄。</p></div></div>
          <div class="hotline-list">
            <a v-for="([number, name, note]) in trip.emergency.hotlines" :key="number" class="hotline-row" :href="`tel:${number}`">
              <span class="hotline-copy"><b>{{ name }}</b><strong>{{ number }}</strong><small>{{ note }}</small></span>
              <span class="hotline-go">撥號</span>
            </a>
          </div>
        </section>

        <section class="content-section" aria-labelledby="typhoon-title">
          <div class="section-title-row"><div><p class="section-kicker">TYPHOON</p><h2 id="typhoon-title">颱風與班機</h2><p class="section-caption">{{ trip.typhoon.caption }}</p></div></div>
          <div class="stage-list">
            <article v-for="stage in trip.typhoon.stages" :key="stage.title">
              <div class="stage-top"><span>{{ stage.when }}</span><strong>{{ stage.title }}</strong></div>
              <ol><li v-for="step in stage.steps" :key="step">{{ step }}</li></ol>
            </article>
          </div>
          <div class="actions">
            <a v-for="([label, url]) in trip.typhoon.links" :key="url" class="action" :href="url" target="_blank" rel="noopener noreferrer">{{ label }}</a>
          </div>
        </section>

        <details class="fold">
          <summary><strong>護照或錢包遺失</strong><small>只有 9/24 辦得了事，先看這個</small></summary>
          <div class="fold-body">
            <p class="fold-warning">{{ trip.emergency.lost.warning }}</p>
            <ol class="step-list">
              <li v-for="([title, desc]) in trip.emergency.lost.steps" :key="title">
                <strong>{{ title }}</strong><span>{{ desc }}</span>
              </li>
            </ol>
            <p class="fold-note"><b>辦事處時間：</b>{{ trip.emergency.lost.office }}</p>
          </div>
        </details>

        <details class="fold">
          <summary><strong>網路不通 / eSIM 沒啟用</strong><small>導航、翻譯、USJ 抽券都要網路</small></summary>
          <div class="fold-body">
            <p class="fold-warning">{{ trip.emergency.noNetwork.warning }}</p>
            <ol class="step-list">
              <li v-for="([title, desc]) in trip.emergency.noNetwork.steps" :key="title">
                <strong>{{ title }}</strong><span>{{ desc }}</span>
              </li>
            </ol>
          </div>
        </details>

        <details class="fold">
          <summary><strong>生病或受傷</strong><small>看診收據就是理賠文件</small></summary>
          <div class="fold-body">
            <div class="rule-list">
              <article v-for="([title, desc]) in trip.emergency.medical" :key="title">
                <strong>{{ title }}</strong><p>{{ desc }}</p>
              </article>
            </div>
            <a class="fold-link" :href="trip.emergency.sourceUrl" target="_blank" rel="noopener noreferrer">駐大阪辦事處 急難救助專區</a>
          </div>
        </details>

        <details class="fold">
          <summary><strong>講不出來的時候</strong><small>直接把螢幕給對方看</small></summary>
          <div class="fold-body">
            <div class="phrase-list">
              <article v-for="([zh, jp, romaji]) in trip.phrases" :key="jp">
                <small>{{ zh }}</small><strong>{{ jp }}</strong><span>{{ romaji }}</span>
              </article>
            </div>
          </div>
        </details>

        <section class="content-section emergency-section" aria-labelledby="emergency-title">
          <div class="section-title-row">
            <div><p class="section-kicker">MY INFO</p><h2 id="emergency-title">緊急資訊卡</h2><p class="section-caption">填在這支手機；不會出現在公開頁面。</p></div>
          </div>
          <form class="emergency-form" @submit.prevent="persistEmergencyInfo">
            <label><span>飯店名稱</span><input v-model.trim="emergencyInfo.hotelName" maxlength="160" placeholder="例如：Just Sleep Osaka Shinsaibashi" /></label>
            <label><span>日文地址</span><input v-model.trim="emergencyInfo.hotelAddress" maxlength="160" placeholder="貼上飯店官方日文地址" /></label>
            <label><span>飯店電話</span><input v-model.trim="emergencyInfo.hotelPhone" type="tel" maxlength="40" placeholder="例如：06-0000-0000" /></label>
            <label><span>訂房編號</span><input v-model.trim="emergencyInfo.booking" maxlength="80" placeholder="輸入後只留在本機" /></label>
            <label><span>保險聯絡方式</span><input v-model.trim="emergencyInfo.insurance" maxlength="160" placeholder="保險公司電話或保單位置" /></label>
            <label><span>緊急聯絡人</span><input v-model.trim="emergencyInfo.contact" maxlength="160" placeholder="姓名＋電話" /></label>
            <button class="primary-cta emergency-save" type="submit">儲存緊急資訊</button>
          </form>
          <p v-if="emergencyError" class="shopping-error" role="alert">{{ emergencyError }}</p>
        </section>
      </template>
    </div>

    <footer class="site-footer">
      <p class="verified-line"><b>資料最後確認</b>{{ trip.verifiedAt }}</p>
      <p>少折返、少排隊，把時間留給真的想玩的地方。</p>
      <small>{{ trip.volatileNote }}</small>
      <small>公開頁面只放行程資訊，不包含訂位代碼、電子機票憑證、票號、護照或 QR Code。</small>
    </footer>
  </main>

  <nav v-if="activeView === 'itinerary'" class="bottom-nav" aria-label="每日行程">
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
