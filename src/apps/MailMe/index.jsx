import { useState } from 'react'
import './styles.css'
// TRAEMOS LA URL DEL WEBHOOK DESDE LAS VARIABLES DE ENTORNO (.env)
const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL

function MailMe() {
  const [form, setForm] = useState({ from_email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.from_email || !form.subject || !form.message) return

    setStatus('sending')
    try {
      const res = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
      setForm({ from_email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mailme-container">
      {status === 'success' && (
        <div className="mailme-success">Message sent successfully!</div>
      )}
      {status === 'error' && (
        <div className="mailme-error">Failed to send. Try again later.</div>
      )}
      <form className="mailme-form" onSubmit={handleSubmit}>
        <label className="mailme-label">
          Your email
          <input
            className="mailme-input"
            type="email"
            name="from_email"
            value={form.from_email}
            onChange={handleChange}
            required
          />
        </label>
        <label className="mailme-label">
          Subject
          <input
            className="mailme-input"
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </label>
        <label className="mailme-label">
          Message
          <textarea
            className="mailme-textarea"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </label>
        <button
          className="mailme-button"
          type="submit"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default MailMe
