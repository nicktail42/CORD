import { test, expect } from '@playwright/test'
// Tests never send live inquiries, even when local Formspree configuration exists.
test.beforeEach(async ({ page }) => {
  await page.route('https://formspree.io/**', route => route.abort())
})
async function fillInquiry(page) {
  await page.getByLabel('Full name').fill('Site Review Test')
  await page.getByLabel('Email address').fill('test@example.com')
  await page.getByLabel('Contact number').fill('+63 917 123 4567')
  await page.getByLabel('Service interested in').selectOption('cmp-mobilization')
  await page.getByLabel('Tell us about your community').fill('Testing a project inquiry, not a live submission.')
  await page.getByRole('checkbox').check()
}
test('all routes, images, metadata and responsive widths', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/about', '/services', '/projects', '/contact', '/missing']) {
      await page.goto(path)
      await expect(page.locator('main h1')).toBeVisible()
      await expect(page).toHaveTitle(/CORD Mobilizer/)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.locator('img').evaluateAll(images => images.forEach(img => { img.loading = 'eager' }))
      await expect.poll(() => page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true)
    }
  }
  expect(errors).toEqual([])
})
test('mobile menu, service preselection and validation', async ({ page }) => {
  await page.route('**/src/services/inquiryService.js', async route => {
    const response = await route.fetch()
    const source = await response.text()
    await route.fulfill({ response, body: source.replace(/export const formId = .*?(?=\r?\n)/, "export const formId = ''") })
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('navigation').getByRole('link', { name: 'Services', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('link', { name: 'Inquire about this service' }).first().click()
  await expect(page.getByLabel('Service interested in')).toHaveValue('community-organizing')
  await page.getByRole('button', { name: 'Send Inquiry', exact: true }).click()
  await expect(page.getByLabel('Full name')).toBeFocused()
  await expect(page.getByLabel('Email address')).toHaveAttribute('aria-invalid', 'true')
  await fillInquiry(page)
  await page.getByRole('button', { name: 'Send Inquiry', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('not configured')
  await expect(page.getByLabel('Full name')).toHaveValue('Site Review Test')
  await expect(page.getByText('Thank you!')).toHaveCount(0)
})
test('project filters and accessible image preview', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('button', { name: 'Leadership Formation', exact: true }).click()
  await expect(page.locator('.project-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Preview Growing community voices' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})
test('provider adapter rejects failures and confirms success', async ({ page }) => {
  await page.goto('/contact')
  const result = await page.evaluate(async () => {
    const { submitInquiry } = await import('/src/services/inquiryService.js')
    const attempts = []
    for (const response of [new Response(JSON.stringify({ ok: true }), { status: 200 }), new Response('{}', { status: 200 }), new Response('{}', { status: 422 })]) {
      try { await submitInquiry({ email: 'test@example.com' }, { formId: 'test', fetcher: async () => response }); attempts.push('success') }
      catch { attempts.push('error') }
    }
    return attempts
  })
  expect(result).toEqual(['success', 'error', 'error'])
})
test('form loading, duplicate prevention and success using a mocked adapter', async ({ page }) => {
  let count = 0
  await page.route('**/src/services/inquiryService.js', route => route.fulfill({ contentType: 'application/javascript', body: `export const isInquiryConfigured=true; export async function submitInquiry(data){const r=await fetch('/mock-inquiry',{method:'POST',body:JSON.stringify(data)});if(!r.ok)throw new Error('Test submission failed');return r.json()}` }))
  await page.route('**/mock-inquiry', async route => { count++; await new Promise(resolve => setTimeout(resolve, 700)); await route.fulfill({ json: { ok: true } }) })
  await page.goto('/contact')
  await fillInquiry(page)
  await page.getByRole('button', { name: 'Send Inquiry', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  await expect(page.getByLabel('Full name')).toBeDisabled()
  await expect(page.getByRole('status')).toContainText('Thank you!')
  await expect(page.getByRole('button', { name: 'Inquiry sent' })).toBeDisabled()
  expect(count).toBe(1)
})
test('form retains details when configured provider fails', async ({ page }) => {
  await page.route('**/src/services/inquiryService.js', route => route.fulfill({ contentType: 'application/javascript', body: `export const isInquiryConfigured=true; export async function submitInquiry(){throw new Error('Test provider failure')}` }))
  await page.goto('/contact')
  await fillInquiry(page)
  await page.getByRole('button', { name: 'Send Inquiry', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Test provider failure')
  await expect(page.getByLabel('Full name')).toHaveValue('Site Review Test')
  await expect(page.getByRole('button', { name: 'Send Inquiry', exact: true })).toBeEnabled()
})

test('official purpose is exact and its layout stacks on mobile', async ({ page }) => {
  await page.goto('/about')
  const purpose = 'To be of aid in providing housing for the Informal Settler Families (ISF) by being a Community Organizer, CMP Mobilizer (Social Housing Finance Corporation), and Leadership Formator.'
  await expect(page.locator('.purpose-statement')).toHaveText(purpose)
  await expect(page.getByRole('heading', { name: 'Our Organizational Purpose' })).toBeVisible()
  await page.setViewportSize({ width: 1440, height: 1000 })
  const text = await page.locator('.purpose-grid > div').boundingBox()
  const image = await page.locator('.purpose-grid figure').boundingBox()
  expect(image.x).toBeGreaterThan(text.x + text.width)
  await page.setViewportSize({ width: 390, height: 844 })
  const mobileText = await page.locator('.purpose-grid > div').boundingBox()
  const mobileImage = await page.locator('.purpose-grid figure').boundingBox()
  expect(mobileImage.y).toBeGreaterThan(mobileText.y + mobileText.height)
})

test('all inquiry selections reach the unchanged Formspree adapter', async ({ page }) => {
  await page.route('**/src/services/inquiryService.js', async route => {
    const response = await route.fetch()
    const source = await response.text()
    await route.fulfill({ response, body: source.replace(/export const formId = .*?(?=\r?\n)/, "export const formId = 'test'") })
  })
  const received = []
  await page.route('https://formspree.io/f/test', async route => {
    expect(route.request().method()).toBe('POST')
    received.push(route.request().postDataJSON().service)
    await route.fulfill({ json: { ok: true } })
  })
  const options = ['community-organizing', 'cmp-mobilization', 'housing-assistance', 'leadership-formation', 'general']
  for (const service of options) {
    await page.goto('/contact?service=' + service)
    await expect(page.getByLabel('Service interested in')).toHaveValue(service)
    await expect(page.locator('#service option:not([value=""])')).toHaveText(['Community Organizing', 'CMP Mobilization', 'Housing Assistance and Coordination', 'Leadership Formation', 'General Inquiry'])
    await fillInquiry(page)
    await page.getByLabel('Service interested in').selectOption(service)
    await page.getByRole('button', { name: 'Send Inquiry', exact: true }).click()
    await expect(page.getByRole('status')).toContainText('Thank you!')
  }
  expect(received).toEqual(options)
})
