import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { connectDB } from './config/db.js'
import { seedIfEmpty } from './config/seed.js'
import { initCloudinary } from './config/cloudinary.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import uploadRoutes from './routes/upload.js'
import paymentRoutes from './routes/payments.js'
import chatRoutes from './routes/chat.js'
import adminRoutes from './routes/admin.js'
import Message from './models/Message.js'
import Conversation from './models/Conversation.js'
import User from './models/User.js'

const app = express()
const server = http.createServer(app)
const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((s) => s.trim())

function corsOrigin(origin, callback) {
  if (!origin || clientOrigins.includes(origin)) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const io = new Server(server, {
  cors: { origin: clientOrigins, methods: ['GET', 'POST'] },
})

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/admin', adminRoutes)

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Unauthorized'))
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('name avatar')
    if (!user) return next(new Error('Unauthorized'))
    socket.userId = user._id.toString()
    socket.user = user
    next()
  } catch {
    next(new Error('Unauthorized'))
  }
})

io.on('connection', (socket) => {
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conv:${conversationId}`)
  })

  socket.on('send_message', async ({ conversationId, text, offerAmount }) => {
    try {
      const conversation = await Conversation.findById(conversationId)
      if (!conversation?.participants.some((p) => p.toString() === socket.userId)) {
        return
      }

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        text: text.trim(),
        offerAmount: offerAmount != null ? Number(offerAmount) : undefined,
      })

      conversation.lastMessage = text.trim()
      conversation.lastMessageAt = new Date()
      await conversation.save()

      const populated = await Message.findById(message._id).populate(
        'sender',
        'name avatar'
      )

      io.to(`conv:${conversationId}`).emit('new_message', {
        conversationId,
        message: populated,
      })
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })
})

const PORT = process.env.PORT || 5000

async function start() {
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET missing — using dev default (not for production)')
    process.env.JWT_SECRET = 'edumart-dev-secret-change-me'
  }
  initCloudinary()
  await connectDB()
  await seedIfEmpty()
  server.listen(PORT, () => console.log(`EduMart API running on http://localhost:${PORT}`))
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
