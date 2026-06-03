import { Router } from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

router.use(requireAdmin)

router.get('/stats', async (req, res) => {
  const [users, products, pending, orders, earnings] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'paid' }),
    Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ])

  res.json({
    users,
    products,
    pendingListings: pending,
    paidOrders: orders,
    totalEarnings: earnings[0]?.total || 0,
  })
})

router.get('/products', async (req, res) => {
  const status = req.query.status || 'pending'
  const products = await Product.find({ status })
    .populate('seller', 'name email college')
    .sort({ createdAt: -1 })
  res.json({ products })
})

router.patch('/products/:id', async (req, res) => {
  const { status } = req.body
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'status must be approved or rejected' })
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
})

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  res.json({ users })
})

router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot delete yourself' })
  }
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User removed' })
})

router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: 'Listing removed' })
})

export default router
