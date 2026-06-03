import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()
const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, branch, year, interests } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const isAdmin =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      college: college || '',
      branch: branch || '',
      year: year || '',
      interests: interests || [],
      role: isAdmin ? 'admin' : 'student',
    })

    const token = signToken(user._id)
    res.status(201).json({
      token,
      user: sanitizeUser(user),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email?.toLowerCase() })
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid email or password' })

    const token = signToken(user._id)
    res.json({ token, user: sanitizeUser(user) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) return res.status(400).json({ message: 'Google credential required' })
    if (!googleClient) {
      return res.status(503).json({ message: 'Google login not configured (set GOOGLE_CLIENT_ID)' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] })
    if (!user) {
      const isAdmin =
        process.env.ADMIN_EMAIL &&
        email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        avatar: picture || '',
        role: isAdmin ? 'admin' : 'student',
      })
    } else if (!user.googleId) {
      user.googleId = googleId
      if (picture && !user.avatar) user.avatar = picture
      await user.save()
    }

    const token = signToken(user._id)
    res.json({ token, user: sanitizeUser(user) })
  } catch (err) {
    res.status(401).json({ message: 'Google authentication failed' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) })
})

router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const allowed = ['name', 'college', 'branch', 'year', 'bio', 'avatar', 'interests']
    for (const key of allowed) {
      if (req.body[key] !== undefined) req.user[key] = req.body[key]
    }
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user }
  delete obj.password
  return obj
}

export default router
