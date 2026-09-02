import { expect, test } from '@playwright/test'

const widths = [375, 390, 430]

// 預設分頁會依「距出發幾天」改變，測試一律用 ?view= 指定，避免隨日期漂移。
const openTrip = async (page, view = 'itinerary') => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (route.request().resourceType() === 'image' && url.origin !== 'http://127.0.0.1:4173') {
      return route.abort()
    }
    return route.continue()
  })
  await page.goto(`/osaka-2026-trip/?view=${view}`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: '大阪 5 天 4 夜', exact: true })).toBeVisible()
}

const noHorizontalOverflow = async (page) => {
  const dimensions = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
  expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
}

for (const width of widths) {
  test(`${width}px mobile layout stays within viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await openTrip(page)

    await expect(page.locator('.day-section')).toHaveCount(5)
    await expect(page.locator('.day-nav-button')).toHaveCount(5)
    await expect(page.locator('.journey-list')).toHaveCount(5)
    await expect(page.locator('.timeline-side')).toHaveCount(0)
    await expect(page.locator('.view-tabs button')).toHaveCount(5)
    await expect(page.locator('.critical-row')).toHaveCount(0)
    // 相關規則在外、其餘收摺疊，兩邊加起來仍是完整的 9 條。
    await expect(page.locator('.decision-card')).toHaveCount(9)
    await expect(page.locator('.decision-section > .decision-grid .decision-card')).toHaveCount(5)
    await expect(page.locator('.rain-plan')).toHaveCount(2)
    await expect(page.locator('.choice-row')).toHaveCount(3)

    await noHorizontalOverflow(page)

    const clippedPretext = await page.locator('[data-pretext]').evaluateAll(elements => (
      elements.filter(element => element.scrollHeight > element.clientHeight + 1).length
    ))
    expect(clippedPretext).toBe(0)

    // 戶外、陽光下、單手拿手機：11px 是可讀性的下限，不要為了排版再往下壓。
    const tooSmall = await page.evaluate(() => [...document.querySelectorAll('body *')]
      .filter(el => {
        const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
        if (!ownText) return false
        const rect = el.getBoundingClientRect()
        return rect.width && rect.height && parseFloat(getComputedStyle(el).fontSize) < 11
      })
      .map(el => `${el.className || el.tagName}: ${el.textContent.trim().slice(0, 12)}`))
    expect(tooSmall).toEqual([])

    const firstDay = page.locator('.day-section').first()
    const firstRail = firstDay.locator('.journey-rail').first()
    const firstContent = firstDay.locator('.journey-content').first()
    const [dayBox, railBox, contentBox] = await Promise.all([
      firstDay.boundingBox(),
      firstRail.boundingBox(),
      firstContent.boundingBox()
    ])

    expect(dayBox).not.toBeNull()
    expect(railBox).not.toBeNull()
    expect(contentBox).not.toBeNull()
    expect(railBox.x).toBeGreaterThanOrEqual(dayBox.x)
    expect(railBox.x + railBox.width).toBeLessThanOrEqual(dayBox.x + dayBox.width)
    expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(dayBox.x + dayBox.width)

    const bottomNav = page.locator('.bottom-nav')
    await expect(bottomNav).toBeVisible()
    const navBox = await bottomNav.boundingBox()
    expect(navBox?.width).toBeLessThanOrEqual(width)
  })
}

test('decision rules and touch targets are usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  await expect(page.getByRole('heading', { name: /今天注意|現場切換規則/ })).toBeVisible()
  /*
   * 規則依當天篩選：D1 只留 D1 的兩條加三條全域規則，其餘收進摺疊。
   * 出發前不刪內容，只是換位置，所以摺疊裡必須找得到。
   */
  await expect(page.locator('.decision-section > .decision-grid .decision-card')).toHaveCount(5)
  await expect(page.getByText('巴士是否還等 15:32')).toBeVisible()
  await expect(page.getByText('颱風警報就切應急流程')).toBeVisible()

  const others = page.locator('.other-rules')
  await expect(others.locator('summary')).toContainText('另外 4 條')
  await expect(others.getByText('京都大雨改走室內線')).toBeHidden()
  await others.locator('summary').click()
  await expect(others.getByText('京都大雨改走室內線')).toBeVisible()

  await expect(page.getByText('午餐 A / B / C＋祇園')).toBeVisible()

  // 大阪城已換成難波八阪神社＋黑門市場，兩站都免費且動線是步行。
  await expect(page.getByText('大阪城')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /難波八阪神社/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /黑門市場｜吃早餐/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /焼肉 ソウル/ })).toBeVisible()

  await page.getByRole('tab', { name: /準備/ }).click()
  await expect(page.getByRole('heading', { name: '出發前最後防線' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '出發前確認' })).toBeVisible()
  await expect(page.locator('.critical-row')).toHaveCount(8)
  await expect(page.locator('.day-section')).toHaveCount(0)
  await expect(page.locator('.bottom-nav')).toHaveCount(0)
  // 錢的內容已經移到「花費」分頁，準備分頁不該再出現。
  await expect(page.getByRole('heading', { name: '日幣要準備多少' })).toHaveCount(0)

  const prepLayout = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clippedPretext: [...document.querySelectorAll('[data-pretext]')].filter(element => element.scrollHeight > element.clientHeight + 1).length
  }))
  expect(prepLayout.scrollWidth).toBeLessThanOrEqual(prepLayout.innerWidth)
  expect(prepLayout.clippedPretext).toBe(0)

  const undersizedTargets = await page.locator('.view-tabs button, .primary-cta, .text-button, .fold > summary, .focus-card').evaluateAll(elements => (
    elements.filter(element => element.getBoundingClientRect().height < 44).map(element => element.textContent.trim())
  ))
  expect(undersizedTargets).toEqual([])
})

test('reference folds stay collapsed until opened', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'prep')

  const taxFree = page.locator('.fold', { hasText: '免稅怎麼買才不會出錯' })
  await expect(taxFree).toHaveCount(1)
  await expect(taxFree.locator('.fold-body')).toBeHidden()

  await taxFree.locator('summary').click()
  await expect(taxFree.locator('.fold-body')).toBeVisible()
  await expect(page.getByText('消耗品封袋不可拆')).toBeVisible()

  await noHorizontalOverflow(page)
})

test('money view carries budget, tickets and per-person split', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'money')

  await expect(page.getByRole('heading', { name: '日幣要準備多少' })).toBeVisible()
  await expect(page.getByText('¥30,000–40,000')).toBeVisible()
  await expect(page.getByRole('heading', { name: '門票與入場費' })).toBeVisible()
  await expect(page.getByText('Harukas 300 展望台')).toBeVisible()
  await expect(page.getByRole('heading', { name: '購物與分帳' })).toBeVisible()

  await noHorizontalOverflow(page)
})

test('buy view groups souvenirs and shows the import ban up front', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'buy')

  await expect(page.getByRole('heading', { name: '不知道買什麼的時候' })).toBeVisible()

  // 肉製品帶不回台灣是會被罰錢的，這一區不能藏在摺疊裡。
  const banned = page.locator('.buy-banned')
  await expect(banned).toBeVisible()
  await expect(banned.getByText('所有肉類加工品')).toBeVisible()

  // 分類預設收起來，點開才出現品項。
  const groups = page.locator('.fold', { hasText: '藥妝與常備藥' })
  await expect(groups.locator('.fold-body')).toBeHidden()
  await groups.locator('summary').click()
  await expect(page.getByText('休足時間')).toBeVisible()

  await noHorizontalOverflow(page)
})

test('safety view exposes dialable hotlines and typhoon stages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'safety')

  const hotlines = page.locator('.hotline-row')
  await expect(hotlines).toHaveCount(5)
  await expect(hotlines.first()).toHaveAttribute('href', 'tel:110')
  await expect(page.getByText('台北駐大阪辦事處 急難救助')).toBeVisible()

  await expect(page.getByRole('heading', { name: '颱風與班機' })).toBeVisible()
  await expect(page.locator('.stage-list article')).toHaveCount(3)
  await expect(page.getByRole('heading', { name: '緊急資訊卡' })).toBeVisible()

  // 證件遺失與網路不通是最可能真的發生的兩件事，處置流程要有順序。
  const lost = page.locator('.fold', { hasText: '護照或錢包遺失' })
  await lost.locator('summary').click()
  await expect(lost.locator('.step-list li')).toHaveCount(5)
  await expect(lost.locator('.fold-warning')).toContainText('只有 9/24')

  const network = page.locator('.fold', { hasText: 'eSIM 沒啟用' })
  await network.locator('summary').click()
  await expect(network.locator('.step-list li')).toHaveCount(5)

  await noHorizontalOverflow(page)
})

/*
 * 日本現場可能沒訊號，離線重載必須還看得到行程。
 *
 * 這裡驗證 precache 契約，而不是用 context.setOffline()：實測 setOffline 會讓
 * 子資源繞過 service worker，即使快取正確也會回報失敗（假陰性）。真正的迴歸是
 * 「hash 過的 JS/CSS 沒有被 precache」——首次載入時它們在 SW 接管前就抓完了，
 * 只靠 fetch handler 永遠不會進快取，斷線重載就會變白畫面。
 */
test('service worker precaches the app shell and every hashed asset', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 15000 })

  const cached = await page.evaluate(async () => {
    const names = await caches.keys()
    const urls = []
    for (const name of names) {
      const keys = await (await caches.open(name)).keys()
      urls.push(...keys.map(request => new URL(request.url).pathname))
    }
    return urls
  })

  const referenced = await page.evaluate(() => [
    ...[...document.querySelectorAll('script[src]')].map(el => new URL(el.src).pathname),
    ...[...document.querySelectorAll('link[rel="stylesheet"]')].map(el => new URL(el.href).pathname)
  ])

  expect(referenced.length).toBeGreaterThan(0)
  expect(cached).toContain('/osaka-2026-trip/')
  for (const asset of referenced) expect(cached).toContain(asset)
})

// hero 收合會換掉整塊標題區，別把文件唯一的 h1 一起收掉。
test('the page keeps an h1 after the hero collapses', async ({ page }) => {
  await openTrip(page)
  await expect(page.locator('h1')).toHaveCount(1)

  await page.getByRole('tab', { name: /準備/ }).click()
  await expect(page.locator('.hero-strip')).toBeVisible()
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toHaveText('大阪 5 天 4 夜')
})

// 四支手機都會把這頁加到主畫面，沒有圖示就只能靠網頁截圖認，等於找不到。
test('installable icons resolve', async ({ page, request }) => {
  await openTrip(page)

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
  const manifest = await (await request.get(manifestHref)).json()
  expect(manifest.icons?.length).toBeGreaterThanOrEqual(2)

  for (const icon of manifest.icons) {
    const res = await request.get(icon.src)
    expect(res.status(), `${icon.src} should be served`).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  }

  // iOS 不讀 manifest 的 icons，只認這個 link。
  const appleIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href')
  expect(appleIcon).toBeTruthy()
  expect((await request.get(new URL(appleIcon, page.url()).pathname)).status()).toBe(200)
})

/*
 * manifest 會被打包成 assets/manifest-<hash>.webmanifest，所以裡面的相對路徑是
 * 相對於 assets/ 而不是站台根目錄。start_url 寫 './' 會指到 /assets/，那裡沒有
 * index.html——從主畫面圖示開啟 PWA 就會 404，用瀏覽器開網址卻正常，很難發現。
 */
test('the installed app launches into the itinerary, not a 404', async ({ page, request }) => {
  await openTrip(page)

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
  const manifestUrl = new URL(manifestHref, page.url())
  const manifest = await (await request.get(manifestUrl.href)).json()

  /*
   * 必須比對「解析後的路徑」而不是打得開與否：vite preview 對任何未知路徑都會
   * 回傳 index.html，所以 start_url 指到 /assets/ 在本機照樣 200，只有 GitHub
   * Pages 會 404。這個測試曾經因此在壞掉的版本下通過。
   */
  const siteRoot = new URL('./', new URL(page.url()).origin + '/osaka-2026-trip/').pathname
  const startUrl = new URL(manifest.start_url, manifestUrl)
  expect(startUrl.pathname, 'start_url 必須指向站台根目錄，不能落在 assets/').toBe(siteRoot)

  // scope 必須涵蓋 start_url，否則安裝後的導覽會被踢回瀏覽器。
  const scope = new URL(manifest.scope, manifestUrl)
  expect(scope.pathname).toBe(siteRoot)

  const res = await request.get(startUrl.href)
  expect(res.status()).toBe(200)
  expect(await res.text()).toContain('<div id="app">')

  // 真的從 start_url 開，要看得到行程而不是錯誤頁。
  await page.goto(startUrl.href, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.view-tabs button')).toHaveCount(5)
})

/*
 * 出發前打開跟旅行中打開是兩種完全不同的畫面，而測試機的日期永遠是出發前，
 * 所以旅行中的行為只能靠固定時鐘來驗。這裡假裝現在是 9/23 中午的京都。
 */
test('during the trip the itinerary opens on today', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-23T13:00:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  // 只有今天是展開的，其他四天收起來。
  await expect(page.locator('#d3')).toHaveClass(/is-today/)
  await expect(page.locator('.day-section.is-collapsed')).toHaveCount(4)
  await expect(page.locator('#d1 .journey-item')).toHaveCount(0)
  await expect(page.locator('#d1 .day-expand')).toBeVisible()

  // 13:00 落在「午餐 A / B / C＋祇園」(12:30–15:00)，下一站是錦市場。
  await expect(page.locator('#d3 .stop-now .journey-time')).toHaveText('12:30–15:00')
  await expect(page.locator('#d3 .stop-next .journey-time')).toHaveText('15:15–16:15')
  await expect(page.locator('#d3 .flag-now')).toHaveText('現在')

  /*
   * 底部導覽必須跟畫面上看到的那一天一致。這裡要先等捲動真的停下來再斷言，
   * 否則會在定位動畫途中就通過，變成假的綠燈。
   */
  await page.waitForFunction(() => {
    const y = window.scrollY
    return new Promise(resolve => setTimeout(() => resolve(Math.abs(window.scrollY - y) < 2), 250))
  }, null, { timeout: 10000 })
  await expect(page.locator('.day-nav-button.active')).toContainText('D3')
  await expect(page).toHaveURL(/day=d3/)

  // 收起來的日子仍然打得開。
  await page.locator('#d1 .day-expand').click()
  await expect(page.locator('#d1 .journey-item')).toHaveCount(5)
})

// 站點顯示語意分類而非流水號，且現在／下一站會取代分類，一行最多兩個標籤。
test('stops show a category, replaced by now and next', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-23T13:00:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  await expect(page.locator('.journey-stop')).toHaveCount(0)
  await expect(page.locator('#d3 .journey-item').first().locator('.journey-type')).toHaveText('交通')

  // 現在那一站不顯示分類，改顯示「現在」；status 仍然保留。
  const now = page.locator('#d3 .stop-now')
  await expect(now.locator('.journey-type')).toHaveCount(0)
  await expect(now.locator('.flag-now')).toHaveText('現在')
  await expect(now.locator('.journey-status')).toHaveText('現場三選一')
  await expect(now.locator('.journey-meta > *')).toHaveCount(3)

  await expect(page.locator('#d3 .stop-next .journey-type')).toHaveCount(0)
  await expect(page.locator('#d3 .stop-next .flag-next')).toHaveText('下一站')
})

// 離開「現在」才出現的回位按鈕，不做常駐浮動元件。
test('back-to-now appears only when the current stop is off screen', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-23T13:00:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  const button = page.locator('.back-to-now')
  await expect(button).toBeHidden()

  // 滑去看明天，按鈕才出現。
  await page.locator('#d4').scrollIntoViewIfNeeded()
  await expect(button).toBeVisible()
  await expect(button).toHaveText(/回到現在/)

  // 不能蓋住底部導覽。
  const [nav, back] = await Promise.all([
    page.locator('.bottom-nav-inner').boundingBox(),
    button.boundingBox()
  ])
  expect(back.y + back.height).toBeLessThanOrEqual(nav.y + 1)

  await button.click()
  await expect(page.locator('#d3 .stop-now')).toBeInViewport()
  await expect(button).toBeHidden()
})

/*
 * 時間自己走過一站時，.stop-now 會換到別的元素。若 IntersectionObserver 還盯著
 * 舊的那個，「回到現在」就會依上一站的位置決定顯示與否。這裡讓時鐘跨過 12:30。
 */
test('back-to-now follows the current stop when time moves on', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-23T12:29:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  await expect(page.locator('#d3 .stop-now .journey-time')).toHaveText('10:20–12:30')

  // 跨過 12:30，當前站應自動換成午餐那一段。
  // 用 runFor 而不是 fastForward：只有 runFor 會真的觸發每分鐘的 setInterval。
  await page.clock.runFor(120000)
  await expect(page.locator('#d3 .stop-now .journey-time')).toHaveText('12:30–15:00')

  /*
   * 關鍵：捲到「只有新的當前站在視野、舊的那站已離開」的位置。
   * 若 observer 還盯著舊元素，就會誤判成離開視野而顯示按鈕。
   * 捲到 D5 之類兩站都看不到的地方會讓新舊行為一致，測不出差別。
   */
  await page.locator('#d3-stop-4').evaluate(el => {
    el.scrollIntoView({ block: 'start', behavior: 'instant' })
    window.scrollBy(0, 120)
  })
  await expect(page.locator('#d3-stop-3')).not.toBeInViewport()
  await expect(page.locator('#d3-stop-4')).toBeInViewport()
  await expect(page.locator('.back-to-now')).toBeHidden()

  // 真的捲走時仍要正常出現，並能捲回新的當前站。
  await page.locator('#d5').scrollIntoViewIfNeeded()
  await expect(page.locator('.back-to-now')).toBeVisible()
  await page.locator('.back-to-now').click()
  await expect(page.locator('#d3 .stop-now')).toBeInViewport()
  await expect(page.locator('.back-to-now')).toBeHidden()
})

// PWA 整晚開著跨過午夜時，Today Mode 必須自己換日，不能等使用者重新載入。
test('today rolls over at midnight without a reload', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-23T23:58:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  await expect(page.locator('.day-section.is-today')).toHaveAttribute('id', 'd3')

  await page.clock.runFor(300000)
  await expect(page.locator('.day-section.is-today')).toHaveAttribute('id', 'd4')
  await expect(page.locator('#d3.is-collapsed')).toHaveCount(1)
})

/*
 * D4 早上三站的 time 是「一開園」「進場後」「白天」，引擎讀不到 HH:mm 就會整個
 * 早上停在「開始排 USJ」、下一站直接跳 11:30——偏偏那是最需要指引的四小時。
 * progressTime 讓顯示保持自然語言、引擎照樣能定位。
 */
test('D4 today engine covers the untimed morning stops', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-24T08:00:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)
  await expect(page.locator('#d4 .stop-now h3')).toContainText('抽全員的整理券')
  await expect(page.locator('#d4 .stop-next h3')).toContainText('其餘大型設施')
})

test('D4 today engine still points home after the park closes', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-24T21:45:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)
  await expect(page.locator('#d4 .stop-now h3')).toContainText('走回環球塔')
})

// 整組勾完就收合，還沒做的才會留在畫面上。
test('a fully checked group collapses and can be reopened', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'prep')

  const group = page.locator('.check-group').first()
  const boxes = group.locator('input[type="checkbox"]')
  const total = await boxes.count()
  await expect(group.locator('.check-row').first()).toBeVisible()

  for (let i = 0; i < total; i++) await boxes.nth(i).check()

  await expect(group.locator('summary b')).toHaveText(`${total} / ${total}`)
  await expect(group.locator('.check-row').first()).toBeHidden()

  await group.locator('summary').click()
  await expect(group.locator('.check-row').first()).toBeVisible()
})

/*
 * 站與站中間的空白原本在時間軸上完全沒有交代。分鐘數必須由站點時間算出來，
 * 不能寫死，否則改了時間就會對不上；而 D4 園內用 progressTime 推估的錨點
 * 之間不是真的移動，算出來的間隔是假的，不能顯示。
 */
test('gaps between stops say how long and what for', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  // 08:25–09:05 → 09:20：15 分，且說明來自下一站的交通卡。
  const kuromon = page.locator('#d2-stop-2 .journey-gap')
  await expect(kuromon.locator('b')).toHaveText('15 分')
  await expect(kuromon.locator('span')).toContainText('步行約 12 分鐘')

  // 沒有交通卡的那些，改用 gapNote 說明。
  const bic = page.locator('#d2-stop-5 .journey-gap')
  await expect(bic.locator('b')).toHaveText('10 分')
  await expect(bic.locator('span')).toContainText('日本橋走到難波')

  // 每天第一站前面沒有空檔。
  await expect(page.locator('#d2-stop-0 .journey-gap')).toHaveCount(0)

  // 園內那幾站用 progressTime，不能生出假的間隔。
  await expect(page.locator('#d4-stop-4 .journey-gap')).toHaveCount(0)
  await expect(page.locator('#d4-stop-5 .journey-gap')).toHaveCount(0)
})

// 手機沒切時區是很常見的，行程時間一律以日本時間為準，不能跟著裝置跑。
test('the current stop uses Japan time even on a Taipei phone', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Taipei' })
  const page = await context.newPage()
  await page.clock.install({ time: new Date('2026-09-23T13:00:00+09:00') })
  await openTrip(page)

  // 台北時間是 12:00，日本是 13:00。要落在 12:30 開始的那一站，不是前一站。
  await expect(page.locator('#d3 .stop-now .journey-time')).toHaveText('12:30–15:00')
  await context.close()
})

/*
 * 一般 Studio Pass 不能再入場。行程若把休息排在園外，晚上的 Halloween Horror
 * Nights 就整段沒了，所以這條規則必須留在頁面上，D4 也不能出現離園休息。
 */
test('D4 never sends anyone out of the park to rest', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-24T09:00:00+09:00') })
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  // D4 當天，這條規則必須直接在外層顯示，不能藏在摺疊裡。
  await expect(page.locator('.decision-section > .decision-grid').getByText('進了 USJ 就不能出園')).toBeVisible()

  // 沒買快速通關，整理券是唯一保障，打法不能從頁面上消失。
  await page.getByRole('tab', { name: /準備/ }).click()
  const usj = page.locator('.fold', { hasText: '不買快速通關' })
  await usj.locator('summary').click()
  await expect(usj.locator('.step-list li')).toHaveCount(6)
  await expect(usj.getByText(/開園先衝咚奇剛/)).toBeVisible()
  await page.getByRole('tab', { name: /行程/ }).click()

  const d4 = page.locator('#d4')
  await expect(d4.getByRole('heading', { name: /園內 Recovery/ })).toBeVisible()
  await expect(d4.getByText('回環球塔休息')).toHaveCount(0)
  await expect(d4.getByText(/走出閘門就回不去|出去就回不來/).first()).toBeVisible()
})

// 切分頁必須留下歷史記錄，否則 Android 的返回鍵會直接離開網站。
test('back button moves between tabs instead of leaving', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'prep')

  await page.getByRole('tab', { name: /花費/ }).click()
  await expect(page).toHaveURL(/view=money/)
  await page.getByRole('tab', { name: /應急/ }).click()
  await expect(page).toHaveURL(/view=safety/)

  await page.goBack()
  await expect(page).toHaveURL(/view=money/)
  await expect(page.getByRole('heading', { name: '日幣要準備多少' })).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(/view=prep/)
  await expect(page.getByRole('heading', { name: '出發前最後防線' })).toBeVisible()
})

test('bottom navigation scrolls to the selected day', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  const day5Button = page.locator('.day-nav-button').nth(4)
  await day5Button.click()
  await expect(page.locator('#d5')).toBeInViewport()
})

test('checklist persists after reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'prep')

  const firstCheck = page.locator('.check-row input').first()
  if (await firstCheck.isChecked()) await firstCheck.uncheck()
  await firstCheck.check()
  await expect(firstCheck).toBeChecked()

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('tab', { name: /準備/ }).click()
  await expect(page.locator('.check-row input').first()).toBeChecked()
})

// 旅行中隨手記的東西掉了就沒了，存檔與備份都要真的動。
test('day notes persist and travel with the backup', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page)

  const note = page.locator('#d3 .day-note')
  await expect(note.locator('summary b')).toHaveText('空白')
  await note.locator('summary').click()
  await note.locator('textarea').fill('錦市場那家玉子燒要再買一份')
  await expect(note.locator('summary b')).toHaveText('已寫')

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('tab', { name: /行程/ }).click()
  await expect(page.locator('#d3 .day-note textarea')).toHaveValue('錦市場那家玉子燒要再買一份')

  // 備份帶得走，換手機才不會整份不見。
  const exported = await page.evaluate(() => JSON.parse(localStorage.getItem('osaka_2026_day_notes')))
  expect(exported.d3).toBe('錦市場那家玉子燒要再買一份')
})

test('shopping calculator updates totals, split and persists user items', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'money')

  await expect(page.getByRole('heading', { name: '購物與分帳' })).toBeVisible()
  await expect(page.getByText('還沒有購物項目')).toBeVisible()

  await page.getByLabel('品名', { exact: true }).fill('USJ 瑪利歐帽')
  await page.getByLabel('單價（日幣）').fill('1200')
  // 數量收在進階欄位裡，預設 1；要改才需要打開。
  await page.locator('.shopping-more summary').click()
  await page.getByLabel('數量', { exact: true }).fill('2')
  await page.getByRole('button', { name: '加入購物清單' }).click()

  await expect(page.locator('.shopping-entry')).toHaveCount(1)
  await expect(page.locator('.shopping-summary > div').first().locator('strong')).toHaveText('¥2,400')

  // 預設歸屬是「共用」，4 個人各分攤 1/4。
  await expect(page.locator('.split-row')).toHaveCount(4)
  await expect(page.locator('.split-row').first().locator('b')).toHaveText('¥600')

  await page.locator('.shopping-entry input[type="number"]').first().fill('1500')
  await expect(page.locator('.shopping-summary > div').first().locator('strong')).toHaveText('¥3,000')
  await expect(page.locator('.split-row').first().locator('b')).toHaveText('¥750')

  await noHorizontalOverflow(page)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('tab', { name: /花費/ }).click()
  await expect(page.locator('.shopping-entry')).toHaveCount(1)
  await expect(page.locator('.shopping-summary > div').first().locator('strong')).toHaveText('¥3,000')
})
