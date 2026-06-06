import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const CATEGORIES = [
  { value: 'notes', label: 'Notes', icon: '📚', desc: 'Study notes with optional PDF' },
  { value: 'physical', label: 'Physical', icon: '📦', desc: 'Books, gear & campus essentials' },
  { value: 'digital', label: 'Digital', icon: '💾', desc: 'Templates, assets & downloads' },
  { value: 'freelance', label: 'Freelance', icon: '💻', desc: 'Services from fellow students' },
]

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
  const [step, setStep] = useState(1)

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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
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
      navigate(`/marketplace/seller`, { state: { created: product._id } })
    } catch (err) {
      setError(err.message)
    }
  }

  const canProceed =
    step === 1
      ? form.title.trim() && form.description.trim()
      : step === 2
        ? form.price && Number(form.price) >= 0
        : true

  return (
    <main className="sell-page">
      <section className="sell-hero">
        <div className="container sell-hero-inner">
          <p className="sell-hero-label">Publish a listing</p>
          <h1>List your product on campus</h1>
          <p className="sell-hero-desc">
            Your listing goes live instantly — buyers see it on the marketplace right away.
          </p>
          <div className="sell-steps">
            {['Details', 'Pricing', 'Media'].map((label, i) => (
              <div
                key={label}
                className={`sell-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}
              >
                <span className="sell-step-num">{i + 1}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section sell-section">
        <div className="container sell-layout">
          <aside className="sell-aside">
            {priceHint && (
              <div className="sell-tip-card">
                <span className="sell-tip-icon">💡</span>
                <div>
                  <strong>AI price tip</strong>
                  <p>{priceHint}</p>
                </div>
              </div>
            )}
            <div className="sell-tip-card sell-tip-muted">
              <strong>Instant publish</strong>
              <p>No waiting — your listing appears on the buyer marketplace immediately.</p>
            </div>
          </aside>

          <form className="sell-form-card" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="sell-form-step">
                <h2>What are you selling?</h2>
                <div className="sell-category-grid">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`sell-category-card ${form.category === c.value ? 'active' : ''}`}
                      onClick={() => update('category', c.value)}
                    >
                      <span className="sell-category-icon">{c.icon}</span>
                      <strong>{c.label}</strong>
                      <span>{c.desc}</span>
                    </button>
                  ))}
                </div>
                <label>
                  <span>Title</span>
                  <input
                    required
                    placeholder="e.g. Engineering Maths Sem 3 Notes"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                  />
                </label>
                <label>
                  <span>Description</span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what's included, condition, delivery…"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                  />
                </label>
                <label>
                  <span>College (optional)</span>
                  <input
                    placeholder={user?.college || 'Your college'}
                    value={form.college}
                    onChange={(e) => update('college', e.target.value)}
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="sell-form-step">
                <h2>Set your price</h2>
                <label className="sell-price-field">
                  <span>Price (₹)</span>
                  <div className="sell-price-input-wrap">
                    <span className="sell-price-prefix">₹</span>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="0"
                      value={form.price}
                      onChange={(e) => update('price', e.target.value)}
                    />
                  </div>
                </label>
                {form.price && (
                  <p className="sell-price-preview">
                    Buyers will see:{' '}
                    <strong>₹{Number(form.price).toLocaleString('en-IN')}</strong>
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="sell-form-step">
                <h2>Add photos</h2>
                <label className="sell-upload-zone">
                  <input type="file" accept="image/*" multiple onChange={handleImage} />
                  <span className="sell-upload-icon">📷</span>
                  <strong>Upload product images</strong>
                  <span>PNG, JPG — tap to browse</span>
                </label>
                {images.length > 0 && (
                  <div className="sell-image-preview">
                    {images.map((url, i) => (
                      <div key={url + i} className="sell-image-thumb">
                        <img src={url} alt="" />
                        <button type="button" onClick={() => removeImage(i)} aria-label="Remove">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {form.category === 'notes' && (
                  <label className="sell-upload-zone sell-upload-pdf">
                    <input type="file" accept="application/pdf" onChange={handlePdf} />
                    <span className="sell-upload-icon">📄</span>
                    <strong>Notes PDF (optional)</strong>
                    <span>Delivered to buyer after purchase</span>
                    {notesPdf && <span className="sell-pdf-done">PDF uploaded ✓</span>}
                  </label>
                )}
              </div>
            )}

            {error && <p className="form-error">{error}</p>}

            <div className="sell-form-nav">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </button>
              )}
              <div className="sell-form-nav-right">
                {step < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    disabled={!canProceed}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading…' : 'Publish listing'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
