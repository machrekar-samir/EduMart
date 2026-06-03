import { Router } from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { productId } = req.body
    const product = await Product.findById(productId)
    if (!product || product.status !== 'approved') {
      return res.status(404).json({ message: 'Product not available' })
    }
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot buy your own listing' })
    }

    const amountPaise = Math.round(product.price * 100)
    const order = await Order.create({
      product: product._id,
      buyer: req.user._id,
      seller: product.seller,
      amount: product.price,
    })

    const razorpay = getRazorpay()
    if (!razorpay) {
      return res.json({
        demo: true,
        orderId: order._id,
        amount: amountPaise,
        currency: 'INR',
        keyId: 'demo',
        message: 'Configure RAZORPAY_KEY_ID for live payments (UPI, Cards, Net Banking)',
      })
    }

    const rzOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: order._id.toString().slice(-8),
    })

    order.razorpayOrderId = rzOrder.id
    await order.save()

    res.json({
      orderId: order._id,
      razorpayOrderId: rzOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/verify', requireAuth, async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body

    const order = await Order.findById(orderId)
    if (!order || order.buyer.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex')
      if (expected !== razorpay_signature) {
        order.status = 'failed'
        await order.save()
        return res.status(400).json({ message: 'Payment verification failed' })
      }
    }

    order.status = 'paid'
    order.razorpayPaymentId = razorpay_payment_id || 'demo'
    await order.save()

    await Product.findByIdAndUpdate(order.product, { status: 'sold' })

    res.json({ message: 'Payment successful', order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/orders', requireAuth, async (req, res) => {
  const filter =
    req.user.role === 'admin'
      ? {}
      : { $or: [{ buyer: req.user._id }, { seller: req.user._id }] }
  const orders = await Order.find(filter)
    .populate('product', 'title price images')
    .populate('buyer seller', 'name email')
    .sort({ createdAt: -1 })
  res.json({ orders })
})

export default router
