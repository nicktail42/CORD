import { useRef, useState } from 'react'
import { Send, LoaderCircle, CheckCircle2, Info } from 'lucide-react'
import { services } from '../data/content'
import { validateInquiry } from '../utils/validation'
import { submitInquiry, isInquiryConfigured } from '../services/inquiryService'
export default function InquiryForm({ initialService = '' }) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [notice, setNotice] = useState('')
  const busy = useRef(false)
  async function handleSubmit(event) {
    event.preventDefault()
    if (busy.current) return
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    data.consent = data.consent === 'on'
    const invalid = validateInquiry(data)
    if (!services.some(s => s.id === data.service) && data.service !== 'general') invalid.service = 'Select an available service.'
    setErrors(invalid)
    if (Object.keys(invalid).length) { setNotice('Please check the highlighted fields.'); form.elements.namedItem(Object.keys(invalid)[0])?.focus(); return }
    busy.current = true
    setStatus('loading'); setNotice('')
    try { await submitInquiry(data); setStatus('success'); setNotice('Thank you! Your inquiry has been received. We look forward to discussing your project.'); form.reset() }
    catch (error) { setStatus('error'); setNotice(error.message) }
    finally { busy.current = false }
  }
  function field(name, label, type, maxLength, placeholder, required = true) { return <label className={name === 'location' ? 'full' : ''} htmlFor={name}>{label}{required && <span className="required"> *</span>}<input id={name} name={name} type={type} maxLength={maxLength} placeholder={placeholder} required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} autoComplete={{ name: 'name', email: 'email', phone: 'tel' }[name]} />{errors[name] && <span className="field-error" id={`${name}-error`}>{errors[name]}</span>}</label> }
  return <form className="inquiry-form" noValidate onSubmit={handleSubmit} aria-busy={status === 'loading'}>
    {!isInquiryConfigured && <p className="config-notice"><Info size={18} /> Preview mode: email delivery awaits Formspree configuration.</p>}
    <fieldset disabled={status === 'loading' || status === 'success'}><legend className="sr-only">Project inquiry details</legend><div className="form-grid">{field('name', 'Full name', 'text', 100, 'Your full name')}{field('email', 'Email address', 'email', 254, 'you@example.com')}{field('phone', 'Contact number', 'tel', 30, '+63 …')}<label htmlFor="service">Service interested in <span className="required">*</span><select id="service" name="service" defaultValue={initialService} required aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined}><option value="">Select a service</option>{services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}<option value="general">General inquiry / Not sure yet</option></select>{errors.service && <span className="field-error" id="service-error">{errors.service}</span>}</label>{field('location', 'Project location (optional)', 'text', 200, 'City, municipality, or site location', false)}<label className="full" htmlFor="message">Tell us about your project <span className="required">*</span><textarea id="message" name="message" rows={5} maxLength={3000} required placeholder="What do you have in mind? Share your site details, goals, and preferred timeline." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</label></div>
    <div className="honeypot" aria-hidden="true"><label>Leave this blank<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></div>
    <p className="privacy-copy">Your contact and project details are sent to CORD through Formspree to respond to this inquiry. Please avoid including sensitive personal information.</p><label className="consent"><input type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined} /><span>I agree to the processing of my details by CORD and Formspree for this inquiry.</span></label>{errors.consent && <p className="field-error" id="consent-error">{errors.consent}</p>}</fieldset>
    {notice && <p className={`form-notice ${status}`} role={status === 'success' ? 'status' : 'alert'}>{status === 'success' && <CheckCircle2 size={20} />}{notice}</p>}
    <button className="button" disabled={status === 'loading' || status === 'success'} type="submit">{status === 'loading' ? <><LoaderCircle className="spin" size={18} />Sending…</> : status === 'success' ? 'Inquiry sent' : <>Send Inquiry<Send size={17} /></>}</button>
  </form>
}
