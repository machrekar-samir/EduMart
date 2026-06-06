import { Router } from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const [students, listings, colleges] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Product.countDocuments({ status: 'approved' }),
      Product.distinct('college', { college: { $ne: '' } }),
    ])

    res.json({
      students,
      listings,
      colleges: colleges.length,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
