import { expect, test } from '@playwright/test'

const widths = [375, 390, 430]

const openTrip = async (page) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (route.request().resourceType() === 'image' && url.origin !== 'http://127.0.0.1:4173') {
      return route.abort()
    }
    return route.continue()
  })
  await page.goto('/osaka-2026-trip/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: '大阪 5 天 4 夜', exact: true })).toBeVisible()
}

for (const width of widths) {
  test(`${width}px mobile layout stays within viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await openTrip(page)

    await expect(page.locator('.day-section')).toHaveCount(5)
    await expect(page.locator('.day-nav-button')).toHaveCount(5)
    await expect(page.locator('.journey-list')).toHaveCount(5)
    await expect(page.locator('.timeline-side')).toHaveCount(0)
    await expect(page.locator('.view-tabs button')).toHaveCount(2)
    await expect(page.locator('.critical-row')).toHaveCount(0)
    await expect(page.locator('.decision-card')).toHaveCount(3)
    await expect(page.locator('.rain-plan')).toHaveCount(1)
    await expect(page.locator('.choice-row')).toHaveCount(3)

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
    expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)

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
  await expect(page.getByText('大阪城不是必去')).toBeVisible()
  await expect(page.getByText('京都大雨改走室內線')).toBeVisible()
  await expect(page.getByText('午餐 A / B / C＋祇園')).toBeVisible()

  await page.getByRole('tab', { name: /準備/ }).click()
  await expect(page.getByRole('heading', { name: '出發前最後防線' })).toBeVisible()
  await expect(page.locator('.critical-row')).toHaveCount(5)
  await expect(page.locator('.day-section')).toHaveCount(0)
  await expect(page.locator('.bottom-nav')).toHaveCount(0)

  const undersizedTargets = await page.locator('.view-tabs button, .primary-cta, .text-button').evaluateAll(elements => (
    elements.filter(element => element.getBoundingClientRect().height < 44).map(element => element.textContent.trim())
  ))
  expect(undersizedTargets).toEqual([])
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
  await openTrip(page)
  await page.getByRole('tab', { name: /準備/ }).click()

  const firstCheck = page.locator('.check-row input').first()
  if (await firstCheck.isChecked()) await firstCheck.uncheck()
  await firstCheck.check()
  await expect(firstCheck).toBeChecked()

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('tab', { name: /準備/ }).click()
  await expect(page.locator('.check-row input').first()).toBeChecked()
})
