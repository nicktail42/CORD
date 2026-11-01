export function validateInquiry(data) {
  const errors = {}
  if (!data.name?.trim() || data.name.trim().length > 100) errors.name = 'Enter your full name (up to 100 characters).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '') || data.email.length > 254) errors.email = 'Enter a valid email address.'
  const digits = (data.phone || '').replace(/\D/g, '')
  if (!/^[+\d()\s.-]+$/.test(data.phone || '') || digits.length < 7 || digits.length > 15 || data.phone.length > 30) errors.phone = 'Enter a phone number with 7–15 digits.'
  if (!data.service) errors.service = 'Select a service.'
  if (!data.message?.trim() || data.message.trim().length > 3000) errors.message = 'Enter your project details (up to 3,000 characters).'
  if ((data.location || '').length > 200) errors.location = 'Use up to 200 characters.'
  if (!data.consent) errors.consent = 'Please consent to inquiry data processing.'
  return errors
}
