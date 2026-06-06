import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import PageHero from '../components/PageHero'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export default function Chat() {
  const { conversationId } = useParams()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(conversationId || '')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [offer, setOffer] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    api.getConversations().then(({ conversations: list }) => {
      setConversations(list)
      if (!activeId && list[0]) setActiveId(list[0]._id)
    })
  }, [])

  useEffect(() => {
    if (conversationId) setActiveId(conversationId)
  }, [conversationId])

  useEffect(() => {
    if (!activeId) return
    api.getMessages(activeId).then(({ messages: m }) => setMessages(m))

    const token = localStorage.getItem('edumart_token')
    const socket = io(SOCKET_URL, { auth: { token } })
    socketRef.current = socket
    socket.emit('join_conversation', activeId)
    socket.on('new_message', ({ conversationId: cid, message }) => {
      if (cid === activeId) setMessages((prev) => [...prev, message])
    })
    return () => socket.disconnect()
  }, [activeId])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeId) return
    const body = { text: text.trim() }
    if (offer) body.offerAmount = Number(offer)

    socketRef.current?.emit('send_message', {
      conversationId: activeId,
      text: body.text,
      offerAmount: body.offerAmount,
    })

    setText('')
    setOffer('')
  }

  const activeConv = conversations.find((c) => c._id === activeId)
  const other = activeConv?.participants?.find(
    (p) => String(p._id) !== String(user?._id)
  )

  return (
    <main className="chat-page">
      <PageHero label="Chat" title="Buyer & seller messages" description="Real-time messaging, product inquiries, and offer negotiation." />
      <section className="section">
        <div className="container chat-layout">
          <aside className="chat-sidebar">
            <h3>Conversations</h3>
            {conversations.map((c) => {
              const peer = c.participants?.find(
                (p) => String(p._id) !== String(user?._id)
              )
              return (
                <button
                  key={c._id}
                  type="button"
                  className={`chat-thread ${activeId === c._id ? 'active' : ''}`}
                  onClick={() => setActiveId(c._id)}
                >
                  <strong>{peer?.name || 'Chat'}</strong>
                  {c.product?.title && <span>{c.product.title}</span>}
                  <span className="muted">{c.lastMessage}</span>
                </button>
              )
            })}
            {conversations.length === 0 && (
              <p className="muted">
                No chats yet. Open a product and click &quot;Chat with seller&quot;.
              </p>
            )}
          </aside>

          <div className="chat-main">
            {activeId ? (
              <>
                <div className="chat-header">
                  <strong>{other?.name || 'Conversation'}</strong>
                  {activeConv?.product && (
                    <Link to={`/product/${activeConv.product._id}`}>
                      {activeConv.product.title}
                    </Link>
                  )}
                </div>
                <div className="chat-messages">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={`chat-bubble ${String(m.sender?._id) === String(user?._id) ? 'mine' : ''}`}
                    >
                      <p>{m.text}</p>
                      {m.offerAmount != null && (
                        <span className="offer-tag">Offer: ₹{m.offerAmount}</span>
                      )}
                    </div>
                  ))}
                </div>
                <form className="chat-compose" onSubmit={send}>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Message…"
                  />
                  <input
                    type="number"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="Offer ₹ (optional)"
                    className="chat-offer-input"
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <p className="muted">Select a conversation</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
