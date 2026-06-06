import { Router } from 'express'
import { suggestNotePrice } from '../utils/aiStub.js'

const router = Router()

const FAQ = [
  {
    keywords: ['sell', 'listing', 'publish', 'list'],
    reply:
      'To sell on EduMartX, go to Marketplace → For Sellers → List new product. Add title, description, price, and images — your listing goes live instantly for buyers on campus.',
  },
  {
    keywords: ['buy', 'purchase', 'payment', 'pay'],
    reply:
      'Browse the Marketplace, open a product, and tap Buy now. We support Razorpay (UPI, cards, net banking). You can also chat with the seller before buying.',
  },
  {
    keywords: ['note', 'notes', 'pdf'],
    reply:
      'Notes are one of our top categories. Sellers can attach a PDF that buyers receive after purchase. Use the Notes filter in Marketplace to find study material.',
  },
  {
    keywords: ['price', 'pricing', 'cost', 'how much'],
    reply: () => {
      const hint = suggestNotePrice('notes')
      return hint
        ? `${hint}. For other categories, check similar listings in Marketplace for fair campus pricing.`
        : 'Check similar listings in Marketplace to price competitively. Our AI price tips appear when you create a listing.'
    },
  },
  {
    keywords: ['freelance', 'service', 'gig'],
    reply:
      'Find freelance services (web dev, design, editing) under Marketplace → Services or the Freelance page. You can message sellers directly to discuss scope and price.',
  },
  {
    keywords: ['trust', 'safe', 'verify', 'scam'],
    reply:
      'EduMartX is built for students — profiles show college info, and you can chat with sellers before paying. Always review listings and use in-app chat for negotiations.',
  },
  {
    keywords: ['account', 'register', 'sign up', 'login'],
    reply:
      'Create a free account via Get Started or Register. You need to be logged in to buy, sell, and chat on the marketplace.',
  },
  {
    keywords: ['digital', 'template', 'download'],
    reply:
      'Digital products (templates, assets, prompt packs) are in Marketplace → Digital or the Digital page. Instant delivery after purchase.',
  },
]

function matchReply(message) {
  const lower = message.toLowerCase()
  for (const entry of FAQ) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return typeof entry.reply === 'function' ? entry.reply() : entry.reply
    }
  }
  return (
    "I'm EduMartX Assistant — I can help with buying, selling, notes, pricing, payments, and campus marketplace tips. What would you like to know?"
  )
}

router.post('/chat', (req, res) => {
  const { message } = req.body
  if (!message?.trim()) {
    return res.status(400).json({ message: 'Message is required' })
  }
  const reply = matchReply(message.trim())
  res.json({ reply })
})

export default router
