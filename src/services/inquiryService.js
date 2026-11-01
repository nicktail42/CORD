export const formId = import.meta.env?.VITE_FORMSPREE_FORM_ID || ''
export const isInquiryConfigured = /^[a-zA-Z0-9]+$/.test(formId) && !/your|placeholder/i.test(formId)
export async function submitInquiry(data, options = {}) {
  const id = options.formId ?? (isInquiryConfigured ? formId : '')
  if (!id) throw new Error('Inquiry delivery is not configured yet. Set VITE_FORMSPREE_FORM_ID and restart the application. No message has been sent.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await (options.fetcher || fetch)(`https://formspree.io/f/${id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, signal: controller.signal,
      body: JSON.stringify({ ...data, _subject: 'CORD Mobilizer — New project inquiry' }),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || result?.ok !== true) throw new Error('Your inquiry could not be confirmed. Please try again. Your details are still here.')
    return result
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request timed out. Delivery is unconfirmed; check before retrying.', { cause: error })
    if (error instanceof TypeError) throw new Error('Unable to connect. Check your connection and try again. Your details are still here.', { cause: error })
    throw error
  } finally { clearTimeout(timer) }
}
