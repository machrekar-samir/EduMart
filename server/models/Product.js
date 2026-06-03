import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['notes', 'physical', 'digital', 'freelance'],
      required: true,
    },
    images: [{ type: String }],
    notesPdf: { type: String },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    college: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold'],
      default: 'pending',
    },
    tags: [{ type: String }],
    aiPriceHint: { type: String, default: '' },
  },
  { timestamps: true }
)

productSchema.index({ title: 'text', description: 'text', tags: 'text' })

export default mongoose.model('Product', productSchema)
