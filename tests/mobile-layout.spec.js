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
    await expect(page.locator('.decision-card')).toHaveCount(6)
    await expect(page.locator('.rain-plan')).toHaveCount(2)
    await expect(page.locator('.choice-row')).toHaveCount(3)

    await noHorizontalOverflow(page)

    const clippedPretext = await page.locator('[data-pretext]').evaluateAll(elements => (
      elements.filter(element => element.scrollHeight > element.clientHeight + 1).length
    ))
    expect(clippedPretext).toBe(0)

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

  await expect(page.getByRole('heading', { name: '現場切換規則' })).toBeVisible()
  await expect(page.getByText('早上兩站都可以跳過')).toBeVisible()
  await expect(page.getByText('京都大雨改走室內線')).toBeVisible()
  await expect(page.getByText('颱風警報就切應急流程')).toBeVisible()
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

test('shopping calculator updates totals, split and persists user items', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openTrip(page, 'money')

  await expect(page.getByRole('heading', { name: '購物與分帳' })).toBeVisible()
  await expect(page.getByText('還沒有購物項目')).toBeVisible()

  await page.getByLabel('品名', { exact: true }).fill('USJ 瑪利歐帽')
  await page.getByLabel('單價（日幣）').fill('1200')
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
