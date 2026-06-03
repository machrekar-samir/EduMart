import { Router } from 'express'
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/conversations', requireAuth, async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate('participants', 'name avatar')
    .populate('product', 'title price images')
    .sort({ lastMessageAt: -1 })
  res.json({ conversations })
})

router.post('/conversations', requireAuth, async (req, res) => {
  const { productId, sellerId } = req.body
  let product = null
  let otherUserId = sellerId

  if (productId) {
    product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    otherUserId = product.seller
    if (otherUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot chat with yourself' })
    }
  }

  if (!otherUserId) return res.status(400).json({ message: 'sellerId or productId required' })

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, otherUserId] },
    ...(product ? { product: product._id } : {}),
  })

  if (!conversation) {
    conversation = await Conversation.create({
      product: product?._id,
      participants: [req.user._id, otherUserId],
    })
  }

  await conversation.populate('participants', 'name avatar')
  await conversation.populate('product', 'title price images')
  res.json({ conversation })
})

router.get('/conversations/:id/messages', requireAuth, async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
  if (!conversation?.participants.some((p) => p.toString() === req.user._id.toString())) {
    return res.status(403).json({ message: 'Not a participant' })
  }
  const messages = await Message.find({ conversation: conversation._id })
    .populate('sender', 'name avatar')
    .sort({ createdAt: 1 })
  res.json({ messages })
})

router.post('/conversations/:id/messages', requireAuth, async (req, res) => {
  const { text, offerAmount } = req.body
  if (!text?.trim()) return res.status(400).json({ message: 'Message required' })

  const conversation = await Conversation.findById(req.params.id)
  if (!conversation?.participants.some((p) => p.toString() === req.user._id.toString())) {
    return res.status(403).json({ message: 'Not a participant' })
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: text.trim(),
    offerAmount: offerAmount != null ? Number(offerAmount) : undefined,
  })

  conversation.lastMessage = text.trim()
  conversation.lastMessageAt = new Date()
  await conversation.save()

  await message.populate('sender', 'name avatar')
  res.status(201).json({ message })
})

export default router
