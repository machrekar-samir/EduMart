import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api'

const WELCOME =
  "Hi! I'm EduMartX Assistant. Ask me about buying, selling, notes, pricing, or how the marketplace works."

export default function AiChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const { reply } = await api.aiChat(text)
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'Sorry, I could not connect right now. Make sure the server is running.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`ai-chatbot ${open ? 'open' : ''}`}>
      {open && (
        <div className="ai-chatbot-panel" role="dialog" aria-label="EduMartX Assistant">
          <header className="ai-chatbot-header">
            <div>
              <strong>EduMartX Assistant</strong>
              <span>AI help · always on</span>
            </div>
            <button
              type="button"
              className="ai-chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </header>
          <div className="ai-chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`ai-chatbot-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="ai-chatbot-bubble assistant ai-chatbot-typing">
                Thinking…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form className="ai-chatbot-compose" onSubmit={send}>
            <input
              type="text"
              placeholder="Ask about buying, selling, notes…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Chat message"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        className="ai-chatbot-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close assistant' : 'Open EduMartX Assistant'}
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}
