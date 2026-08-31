import { expect, test } from '@playwright/test'

const widths = [375, 390, 430]

for (const width of widths) {
  test(`${width}px mobile layout stays within viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/osaka-2026-trip/', { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: '大阪 5 天 4 夜', exact: true })).toBeVisible()
    await expect(page.locator('.day-section')).toHaveCount(5)
    await expect(page.locator('.day-nav-button')).toHaveCount(5)

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
    expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)

    const bottomNav = page.locator('.bottom-nav')
    await expect(bottomNav).toBeVisible()
    const navBox = await bottomNav.boundingBox()
    expect(navBox?.width).toBeLessThanOrEqual(width)
  })
}

test('checklist persists after reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/osaka-2026-trip/', { waitUntil: 'networkidle' })

  const firstCheck = page.locator('.check-row input').first()
  await firstCheck.uncheck().catch(() => {})
  await firstCheck.check()
  await expect(firstCheck).toBeChecked()

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.locator('.check-row input').first()).toBeChecked()
})
