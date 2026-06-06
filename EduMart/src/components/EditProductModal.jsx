import { useState } from 'react'
import { api } from '../services/api'

export default function EditProductModal({ product, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: String(product.price),
  })
  const [images, setImages] = useState(product.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleImage = async (e) => {
    const files = [...e.target.files]
    if (!files.length) return
    setUploading(true)
    setError('')
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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { product: updated } = await api.updateProduct(product._id, {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        images,
      })
      onSaved(updated)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing permanently?')) return
    setSaving(true)
    setError('')
    try {
      await api.deleteProduct(product._id)
      onDeleted(product._id)
      onClose()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="edit-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="edit-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="edit-product-title"
      >
        <header className="edit-modal-header">
          <h2 id="edit-product-title">Edit listing</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <form onSubmit={handleSave} className="edit-modal-form">
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
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
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
            <span>Images</span>
            <input type="file" accept="image/*" multiple onChange={handleImage} />
          </label>
          {images.length > 0 && (
            <div className="edit-modal-images">
              {images.map((url, i) => (
                <div key={url + i} className="edit-modal-thumb">
                  <img src={url} alt="" />
                  <button type="button" onClick={() => removeImage(i)} aria-label="Remove image">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          <div className="edit-modal-actions">
            <button
              type="button"
              className="btn btn-ghost edit-modal-delete"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete listing
            </button>
            <div className="edit-modal-actions-right">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || uploading}
              >
                {saving ? 'Saving…' : uploading ? 'Uploading…' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
