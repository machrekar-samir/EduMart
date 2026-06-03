import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Product from '../models/Product.js'

export async function seedIfEmpty() {
  const count = await Product.countDocuments()
  if (count > 0) return

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu'
  let seller = await User.findOne({ email: adminEmail })
  if (!seller) {
    seller = await User.create({
      name: 'Demo Seller',
      email: adminEmail,
      password: await bcrypt.hash('admin123', 10),
      college: 'Demo College',
      branch: 'CSE',
      year: '3',
      role: 'admin',
    })
    console.log(`Seed admin: ${adminEmail} / admin123`)
  }

  await Product.insertMany([
    {
      title: 'Engineering Maths – Sem 3 Notes',
      description: 'Complete unit-wise notes with solved examples.',
      price: 79,
      category: 'notes',
      images: [],
      seller: seller._id,
      college: 'Demo College',
      status: 'approved',
      aiPriceHint: 'Your notes can be sold between ₹49-₹79',
    },
    {
      title: 'Resume Template Pack',
      description: 'ATS-friendly resume + cover letter templates.',
      price: 149,
      category: 'digital',
      images: [],
      seller: seller._id,
      status: 'approved',
    },
    {
      title: 'Logo Design – Campus Clubs',
      description: 'Freelance graphic design for student clubs.',
      price: 499,
      category: 'freelance',
      images: [],
      seller: seller._id,
      status: 'approved',
    },
  ])

  console.log('Sample marketplace listings added')
}
