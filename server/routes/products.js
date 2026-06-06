import { Router } from 'express'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
import { suggestNotePrice } from '../utils/aiStub.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, college, status } = req.query
    const filter = {}

    if (req.user?.role === 'admin' && status) {
      filter.status = status
    } else {
      filter.status = 'approved'
    }

    if (category) filter.category = category
    if (college) filter.college = new RegExp(college, 'i')
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filter.$or = [{ title: re }, { description: re }, { tags: re }]
    }

    const products = await Product.find(filter)
      .populate('seller', 'name email avatar college')
      .sort({ createdAt: -1 })
      .limit(100)

    res.json({ products })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/mine', requireAuth, async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 })
  res.json({ products })
})

router.get('/hints/price', (req, res) => {
  const hint = suggestNotePrice(req.query.category || 'notes')
  res.json({ hint, qualityChecker: 'Version 2 — AI Notes Quality Checker' })
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'seller',
    'name email avatar college branch'
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, price, category, images, notesPdf, college, tags } =
      req.body
    if (!title || !description || price == null || !category) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const aiPriceHint =
      category === 'notes' ? suggestNotePrice('notes') : ''

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      images: images || [],
      notesPdf: notesPdf || '',
      college: college || req.user.college,
      tags: tags || [],
      seller: req.user._id,
      status: 'approved',
      aiPriceHint,
    })

    const populated = await Product.findById(product._id).populate(
      'seller',
      'name email avatar college'
    )
    const io = req.app.get('io')
    if (io) io.emit('product_created', { product: populated })

    res.status(201).json({ product: populated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed' })
  }

  const allowed = ['title', 'description', 'price', 'images', 'notesPdf', 'tags', 'status']
  for (const key of allowed) {
    if (req.body[key] !== undefined) product[key] = req.body[key]
  }
  await product.save()
  const populated = await Product.findById(product._id).populate(
    'seller',
    'name email avatar college'
  )
  const io = req.app.get('io')
  if (io) io.emit('product_updated', { product: populated })
  res.json({ product: populated })
})

router.delete('/:id', requireAuth, async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed' })
  }
  const productId = product._id.toString()
  await product.deleteOne()
  const io = req.app.get('io')
  if (io) io.emit('product_deleted', { productId })
  res.json({ message: 'Product removed' })
})

export default router
