import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export default function SellProduct() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [priceHint, setPriceHint] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'notes',
    college: user?.college || '',
  })
  const [images, setImages] = useState([])
  const [notesPdf, setNotesPdf] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.priceHint().then((d) => setPriceHint(d.hint)).catch(() => {})
  }, [])

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleImage = async (e) => {
    const files = [...e.target.files]
    if (!files.length) return
    setUploading(true)
    try {
      const urls = []
      for (const file of files) {
        const { url } = await api.uploadImage(file)
        urls.push(url)
      }
      setImages((prev) => [...prev, ...urls])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handlePdf = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.uploadPdf(file)
      setNotesPdf(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { product } = await api.createProduct({
        ...form,
        price: Number(form.price),
        images,
        notesPdf: form.category === 'notes' ? notesPdf : '',
        college: form.college || user?.college,
      })
      navigate(`/product/${product._id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <PageHero
        label="Sell"
        title="Publish a listing"
        desc="Login → Sell → Upload → Set price → Publish. Listings are reviewed before going live."
      />

      <section className="section">
        <div className="container sell-form-wrap">
          {priceHint && (
            <p className="ai-hint-banner">
              💡 AI price tip (MVP): {priceHint}. Full AI checker in Version 2.
            </p>
          )}

          <form className="sell-form" onSubmit={handleSubmit}>
            <label>
              <span>Title</span>
              <input
                required
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </label>
            <label>
              <span>Category</span>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
              >
                <option value="notes">Notes</option>
                <option value="physical">Physical product</option>
                <option value="digital">Digital product</option>
                <option value="freelance">Freelance service</option>
              </select>
            </label>
            <label>
              <span>Price (₹)</span>
              <input
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
              />
            </label>
            <label>
              <span>College (optional)</span>
              <input
                value={form.college}
                onChange={(e) => update('college', e.target.value)}
              />
            </label>
            <label>
              <span>Product images</span>
              <input type="file" accept="image/*" multiple onChange={handleImage} />
            </label>
            {form.category === 'notes' && (
              <label>
                <span>Notes PDF</span>
                <input type="file" accept="application/pdf" onChange={handlePdf} />
                {notesPdf && <span className="muted">PDF uploaded ✓</span>}
              </label>
            )}
            {error && <p className="form-error">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Publish listing'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
