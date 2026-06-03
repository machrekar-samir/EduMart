import { Router } from 'express'
import multer from 'multer'
import { Readable } from 'stream'
import { cloudinary } from '../config/cloudinary.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

function uploadBuffer(buffer, folder, resourceType = 'image') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `edumart/${folder}`, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    Readable.from(buffer).pipe(stream)
  })
}

router.post('/image', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only images allowed' })
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await uploadBuffer(req.file.buffer, 'products')
      return res.json({ url: result.secure_url, publicId: result.public_id })
    }

    const b64 = req.file.buffer.toString('base64')
    const url = `data:${req.file.mimetype};base64,${b64}`
    res.json({ url, local: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/avatar', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await uploadBuffer(req.file.buffer, 'avatars')
      return res.json({ url: result.secure_url })
    }

    const b64 = req.file.buffer.toString('base64')
    res.json({ url: `data:${req.file.mimetype};base64,${b64}`, local: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/pdf', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files allowed' })
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await uploadBuffer(req.file.buffer, 'notes', 'raw')
      return res.json({ url: result.secure_url })
    }

    const b64 = req.file.buffer.toString('base64')
    res.json({ url: `data:application/pdf;base64,${b64}`, local: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
